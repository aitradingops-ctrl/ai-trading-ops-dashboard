import type { PropsWithChildren } from "react";

import { AppShell } from "@/components/app-shell";
import { requirePageAccess } from "@/lib/page-guards";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const context = await requirePageAccess();

  return <AppShell context={context}>{children}</AppShell>;
}
