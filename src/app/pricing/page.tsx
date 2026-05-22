import Link from "next/link";

import { PricingSubscribeButton } from "@/components/forms/pricing-subscribe-button";
import { SignInButton } from "@/components/sign-in-button";
import { Badge, Card } from "@/components/ui";
import { publicConfig } from "@/lib/public-config";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ blocked?: string; cancelled?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.2),transparent_36rem),#020617] px-4 py-10 text-slate-100">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="py-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            {publicConfig.appName} Access
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white">
            Trading operations access is subscription-based, with admin override.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Subscribe with PayPal, ask an admin for a manual grant, or use the
            admin account configured by <code>APP_ADMIN_EMAIL</code>. Suspended
            and inactive users are blocked even if they can authenticate.
          </p>

          {params.blocked ? (
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              Access check: {params.blocked}
            </div>
          ) : null}

          {params.cancelled ? (
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
              PayPal checkout was cancelled. You can try again when ready.
            </div>
          ) : null}
        </section>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="blue">Internal Pro</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                {publicConfig.appName} subscription
              </h2>
            </div>
            <p className="text-right text-sm text-slate-400">
              Managed by PayPal
              <br />
              Access synced by webhook
            </p>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-slate-300">
            <li>Server-side Google Sheets data access</li>
            <li>Watchlists, signals, risk logs, trades, journal, and alerts</li>
            <li>TradingView embedded charts and alert webhook ingestion</li>
            <li>Manual admin access for exceptions or internal users</li>
          </ul>

          <div className="mt-8 grid gap-3">
            <PricingSubscribeButton />
            <SignInButton callbackUrl="/pricing" />
            <Link
              href="/login"
              className="text-center text-sm font-medium text-cyan-300 hover:text-cyan-200"
            >
              Already approved? Sign in
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
