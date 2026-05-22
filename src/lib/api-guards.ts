import "server-only";

import { NextResponse } from "next/server";

import {
  getCurrentAccessDecision,
  getSessionUser,
  type AccessContext,
  type SessionUser,
} from "@/lib/access-control";

export type ApiGuardResult<T> = T | NextResponse;

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected server error.";
}

export async function requireApiSession(): Promise<ApiGuardResult<SessionUser>> {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return jsonError("Authentication required.", 401);
  }

  return sessionUser;
}

export async function requireApiAccess(): Promise<ApiGuardResult<AccessContext>> {
  const context = await getCurrentAccessDecision();

  if (!context) {
    return jsonError("Authentication required.", 401);
  }

  if (!context.decision.hasAccess) {
    return jsonError(context.decision.reason, 403);
  }

  return context;
}

export async function requireAdminApiAccess(): Promise<
  ApiGuardResult<AccessContext>
> {
  const context = await requireApiAccess();

  if (context instanceof NextResponse) {
    return context;
  }

  if (!context.decision.isAdmin) {
    return jsonError("Admin access required.", 403);
  }

  return context;
}
