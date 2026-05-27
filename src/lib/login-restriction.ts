import "server-only";

import { readRows, stripRowMetadata } from "@/lib/sheets";
import type { UserRecord } from "@/types/models";

export const TEMP_ALLOWED_LOGIN_EMAIL = "aitradingops@gmail.com";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeAccessValue(value: string): string {
  return value.trim().toLowerCase();
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

function envLoginEmails(): string[] {
  const configured = [
    process.env.ALLOWED_LOGIN_EMAILS,
    process.env.ALLOWED_LOGIN_EMAIL,
    TEMP_ALLOWED_LOGIN_EMAIL,
  ]
    .filter(Boolean)
    .join(",");

  return Array.from(
    new Set(configured.split(",").map(normalizeEmail).filter(Boolean)),
  );
}

function userHasSheetLoginAccess(user: UserRecord): boolean {
  const role = normalizeAccessValue(user.role);
  const accessStatus = normalizeAccessValue(user.accessStatus);
  const accessType = normalizeAccessValue(user.accessType);
  const subscriptionStatus = normalizeAccessValue(user.subscriptionStatus);
  const isSuspended =
    role === "suspended" ||
    accessStatus === "suspended" ||
    subscriptionStatus === "suspended";

  if (isSuspended) {
    return false;
  }

  if (role === "admin" || accessType === "admin") {
    return true;
  }

  if (accessStatus !== "active" || isExpired(user.accessExpiresAt)) {
    return false;
  }

  if (role === "manual_user" || accessType === "manual_grant") {
    return true;
  }

  return (
    accessType === "paypal_subscription" &&
    ["active", "payment_completed"].includes(subscriptionStatus)
  );
}

export function getAllowedLoginEmail(): string {
  return envLoginEmails()[0] ?? "";
}

export function getAllowedLoginEmails(): string[] {
  return envLoginEmails();
}

export async function isAllowedLoginEmail(
  email?: string | null,
): Promise<boolean> {
  if (!email) {
    return false;
  }

  const userEmail = normalizeEmail(email);

  if (envLoginEmails().includes(userEmail)) {
    return true;
  }

  try {
    const rows = await readRows<UserRecord>("Users");
    const user = rows
      .map(stripRowMetadata)
      .find((row) => normalizeEmail(row.userEmail) === userEmail);

    return user ? userHasSheetLoginAccess(user) : false;
  } catch (error) {
    console.error("Unable to verify login email against Users sheet.", error);
    return false;
  }
}
