import "server-only";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getOptionalEnv } from "@/lib/env";
import {
  isAllowedLoginEmail,
  TEMP_ALLOWED_LOGIN_EMAIL,
} from "@/lib/login-restriction";
import { readRows, stripRowMetadata, upsertRow } from "@/lib/sheets";
import type {
  AccessDecision,
  AccessStatus,
  AccessType,
  SubscriptionStatus,
  UserRecord,
  UserRole,
} from "@/types/models";

const DEFAULT_ADMIN_EMAIL = TEMP_ALLOWED_LOGIN_EMAIL;

export interface SessionUser {
  email: string;
  name: string;
}

export interface AccessContext {
  sessionUser: SessionUser;
  decision: AccessDecision;
  user: UserRecord;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function adminEmail(): string {
  return normalizeEmail(getOptionalEnv("APP_ADMIN_EMAIL") || DEFAULT_ADMIN_EMAIL);
}

function isExpired(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() < Date.now();
}

function emptyUser(email: string, fullName = ""): UserRecord {
  const now = nowIso();

  return {
    userEmail: normalizeEmail(email),
    fullName,
    role: "paid_user",
    accessStatus: "inactive",
    accessType: "",
    paypalSubscriptionId: "",
    paypalCustomerEmail: "",
    subscriptionStatus: "inactive",
    accessExpiresAt: "",
    createdAt: now,
    updatedAt: now,
    notes: "Created automatically after Google login. Awaiting access grant.",
  };
}

function adminUserRecord(existing?: UserRecord | null): UserRecord {
  const email = adminEmail();

  return {
    ...(existing ?? emptyUser(email, "AI Trading Ops Admin")),
    userEmail: email,
    fullName: existing?.fullName || "AI Trading Ops Admin",
    role: "admin",
    accessStatus: "active",
    accessType: "admin",
    subscriptionStatus: existing?.subscriptionStatus ?? "",
    notes: existing?.notes || "Bootstrapped as the first AI Trading Ops admin.",
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  if (!isAllowedLoginEmail(email)) {
    return null;
  }

  return {
    email: normalizeEmail(email),
    name: session.user?.name ?? "",
  };
}

export async function listUsers(): Promise<UserRecord[]> {
  const rows = await readRows<UserRecord>("Users");

  if (rows.length === 0) {
    const admin = await upsertUser(adminUserRecord());
    return [admin];
  }

  return rows.map(stripRowMetadata);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<UserRecord>("Users");
  const row = rows.find((candidate) => normalizeEmail(candidate.userEmail) === userEmail);

  return row ? stripRowMetadata(row) : null;
}

export async function getUserByPaypalSubscription(
  subscriptionId: string,
): Promise<UserRecord | null> {
  if (!subscriptionId.trim()) {
    return null;
  }

  const rows = await readRows<UserRecord>("Users");
  const row = rows.find(
    (candidate) => candidate.paypalSubscriptionId.trim() === subscriptionId.trim(),
  );

  return row ? stripRowMetadata(row) : null;
}

export async function upsertUser(user: UserRecord): Promise<UserRecord> {
  const existing = await getUserByEmail(user.userEmail);
  const now = nowIso();
  const next: UserRecord = {
    ...emptyUser(user.userEmail, user.fullName),
    ...existing,
    ...user,
    userEmail: normalizeEmail(user.userEmail),
    createdAt: existing?.createdAt || user.createdAt || now,
    updatedAt: now,
  };

  await upsertRow<UserRecord>("Users", ["userEmail"], next);
  return next;
}

export async function ensureUserProfile(
  email: string,
  fullName = "",
): Promise<UserRecord> {
  const userEmail = normalizeEmail(email);

  if (!isAllowedLoginEmail(userEmail)) {
    throw new Error(
      "Access is currently restricted. Please contact AI Trading Ops support.",
    );
  }

  const existing = await getUserByEmail(userEmail);
  const appAdmin = adminEmail();

  if (appAdmin && userEmail === appAdmin) {
    return upsertUser({
      ...adminUserRecord(existing),
      fullName: existing?.fullName || fullName || "AI Trading Ops Admin",
    });
  }

  if (existing) {
    return existing;
  }

  return upsertUser(emptyUser(userEmail, fullName));
}

export function evaluateUserAccess(user: UserRecord | null): AccessDecision {
  if (!user) {
    return {
      hasAccess: false,
      reason: "No user record found.",
      user,
      isAdmin: false,
    };
  }

  const userEmail = normalizeEmail(user.userEmail);
  const isEnvAdmin = Boolean(adminEmail() && userEmail === adminEmail());
  const isAdmin = isEnvAdmin || user.role === "admin" || user.accessType === "admin";
  const isSuspended =
    user.role === "suspended" ||
    user.accessStatus === "suspended" ||
    user.subscriptionStatus === "suspended";

  if (isSuspended) {
    return {
      hasAccess: false,
      reason: "User is suspended.",
      user,
      isAdmin,
    };
  }

  if (isAdmin) {
    return {
      hasAccess: true,
      reason: "Admin access.",
      user,
      isAdmin: true,
    };
  }

  if (user.accessStatus !== "active") {
    return {
      hasAccess: false,
      reason: "User access is inactive.",
      user,
      isAdmin: false,
    };
  }

  if (isExpired(user.accessExpiresAt)) {
    return {
      hasAccess: false,
      reason: "User access has expired.",
      user,
      isAdmin: false,
    };
  }

  if (user.accessType === "manual_grant" || user.role === "manual_user") {
    return {
      hasAccess: true,
      reason: "Manual access grant.",
      user,
      isAdmin: false,
    };
  }

  if (
    user.accessType === "paypal_subscription" &&
    ["active", "payment_completed"].includes(user.subscriptionStatus)
  ) {
    return {
      hasAccess: true,
      reason: "Active PayPal subscription.",
      user,
      isAdmin: false,
    };
  }

  return {
    hasAccess: false,
    reason: "No active subscription, admin access, or manual grant.",
    user,
    isAdmin: false,
  };
}

export async function getCurrentAccessDecision(): Promise<AccessContext | null> {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  const user = await ensureUserProfile(sessionUser.email, sessionUser.name);
  const decision = evaluateUserAccess(user);

  return {
    sessionUser,
    decision,
    user,
  };
}

export async function updateUserAccess(input: {
  userEmail: string;
  fullName?: string;
  role?: UserRole;
  accessStatus?: AccessStatus;
  accessType?: AccessType;
  accessExpiresAt?: string;
  notes?: string;
}): Promise<UserRecord> {
  const existing = await getUserByEmail(input.userEmail);
  const base = existing ?? emptyUser(input.userEmail, input.fullName ?? "");

  return upsertUser({
    ...base,
    fullName: input.fullName ?? base.fullName,
    role: input.role ?? base.role,
    accessStatus: input.accessStatus ?? base.accessStatus,
    accessType: input.accessType ?? base.accessType,
    accessExpiresAt: input.accessExpiresAt ?? base.accessExpiresAt,
    notes: input.notes ?? base.notes,
  });
}

export async function applyPaypalSubscriptionUpdate(input: {
  subscriptionId: string;
  paypalCustomerEmail?: string;
  userEmail?: string;
  subscriptionStatus: SubscriptionStatus;
}): Promise<UserRecord | null> {
  const subscriptionId = input.subscriptionId.trim();
  const paypalCustomerEmail = normalizeEmail(input.paypalCustomerEmail ?? "");
  const userEmail = normalizeEmail(input.userEmail ?? paypalCustomerEmail);
  const existingBySubscription = await getUserByPaypalSubscription(subscriptionId);
  const existingByEmail = userEmail ? await getUserByEmail(userEmail) : null;
  const existing = existingBySubscription ?? existingByEmail;

  if (!existing && !userEmail) {
    return null;
  }

  const base = existing ?? emptyUser(userEmail);
  const preservedAccess =
    base.role === "admin" ||
    base.accessType === "admin" ||
    base.role === "manual_user" ||
    base.accessType === "manual_grant";
  const activeStatuses: SubscriptionStatus[] = ["active", "payment_completed"];
  const isPaidActive = activeStatuses.includes(input.subscriptionStatus);

  return upsertUser({
    ...base,
    role: preservedAccess ? base.role : "paid_user",
    accessStatus: preservedAccess || isPaidActive ? "active" : "inactive",
    accessType: preservedAccess ? base.accessType : "paypal_subscription",
    paypalSubscriptionId: subscriptionId || base.paypalSubscriptionId,
    paypalCustomerEmail: paypalCustomerEmail || base.paypalCustomerEmail,
    subscriptionStatus: input.subscriptionStatus,
    notes: preservedAccess
      ? `${base.notes} PayPal status updated to ${input.subscriptionStatus}.`.trim()
      : base.notes,
  });
}
