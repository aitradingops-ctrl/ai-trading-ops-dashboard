import "server-only";

import { redirect } from "next/navigation";

import {
  getCurrentAccessDecision,
  type AccessContext,
} from "@/lib/access-control";

export async function requirePageAccess(): Promise<AccessContext> {
  const context = await getCurrentAccessDecision();

  if (!context) {
    redirect("/login");
  }

  if (!context.decision.hasAccess) {
    redirect(`/pricing?blocked=${encodeURIComponent(context.decision.reason)}`);
  }

  return context;
}

export async function requireAdminPageAccess(): Promise<AccessContext> {
  const context = await requirePageAccess();

  if (!context.decision.isAdmin) {
    redirect("/dashboard");
  }

  return context;
}
