"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { cn } from "@/lib/utils";

const coreItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/signals", label: "Signals" },
  { href: "/trades", label: "Trades" },
  { href: "/risk", label: "Risk" },
  { href: "/settings", label: "Settings" },
];

export function MobileBottomNav({
  isAdmin,
  projectDriveUrl,
  googleChatUrl,
}: {
  isAdmin: boolean;
  projectDriveUrl: string;
  googleChatUrl: string;
}) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-slate-950/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl">
        <div className="mx-auto grid max-w-screen-sm grid-cols-6 gap-2">
          {coreItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[52px] items-center justify-center rounded-2xl px-2 text-center text-[11px] font-semibold transition",
                  isActive
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-800 bg-slate-900/80 text-slate-300",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <details className="relative">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 px-2 text-center text-[11px] font-semibold text-slate-300">
              More
            </summary>
            <div className="absolute bottom-[calc(100%+0.75rem)] right-0 w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-slate-800 bg-slate-950/98 p-3 shadow-[0_18px_80px_rgba(2,8,23,0.5)]">
              <div className="grid gap-2">
                <Link
                  href="/watchlist"
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100"
                >
                  Watchlist
                </Link>
                <Link
                  href="/journal"
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100"
                >
                  Journal
                </Link>
                <Link
                  href="/calendar"
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100"
                >
                  Calendar
                </Link>
                <Link
                  href="/chat"
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100"
                >
                  Chat
                </Link>
                <a
                  href={projectDriveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100"
                >
                  Project Drive
                </a>
                <a
                  href={googleChatUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100"
                >
                  Google Chat
                </a>
                {isAdmin ? (
                  <Link
                    href="/admin/users"
                    className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200"
                  >
                    Admin
                  </Link>
                ) : null}
                <div className="pt-1">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </details>
        </div>
      </nav>
    </div>
  );
}
