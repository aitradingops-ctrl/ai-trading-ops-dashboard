import Link from "next/link";
import type { PropsWithChildren } from "react";

import { Badge } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";
import type { AccessContext } from "@/lib/access-control";
import { publicConfig } from "@/lib/public-config";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/signals", label: "Signals" },
  { href: "/trades", label: "Trades" },
  { href: "/risk", label: "Risk" },
  { href: "/journal", label: "Journal" },
  { href: "/calendar", label: "Calendar" },
  { href: "/chat", label: "Chat" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  context,
}: PropsWithChildren<{ context: AccessContext }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(8,145,178,0.16),transparent_32rem),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-slate-800/80 bg-slate-950/70 px-4 py-4 backdrop-blur lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/dashboard" className="block">
              <div className="text-lg font-semibold tracking-tight text-white">
                {publicConfig.appName}
              </div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">
                {publicConfig.appDomain}
              </div>
            </Link>
            <div className="lg:hidden">
              <SignOutButton />
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-800 hover:bg-slate-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={publicConfig.projectDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-800 hover:bg-slate-900 hover:text-white"
            >
              Project Drive
            </a>
            {context.decision.isAdmin ? (
              <Link
                href="/admin/users"
                className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
              >
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="mt-8 hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 lg:block">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Signed in
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {context.user.fullName || context.sessionUser.name || "Operator"}
            </p>
            <p className="truncate text-xs text-slate-500">{context.sessionUser.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={context.decision.isAdmin ? "amber" : "green"}>
                {context.user.role}
              </Badge>
              <Badge tone="blue">{context.decision.reason}</Badge>
            </div>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
