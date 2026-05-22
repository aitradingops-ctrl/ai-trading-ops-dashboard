import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { publicConfig } from "@/lib/public-config";

export const metadata: Metadata = {
  title: `${publicConfig.appName} | AI-Assisted Trading Operations`,
  description:
    "Track signals, manage risk, journal trades, monitor TradingView alerts, and build a repeatable trading process from one clean dashboard.",
};

const featureCards = [
  "TradingView alert ingestion",
  "Signal tracking",
  "Watchlist management",
  "Risk dashboard",
  "Trade journal",
  "Google Sheets database",
  "Google Calendar integration",
  "Project Drive access",
  "PayPal subscriptions",
  "Admin-controlled access",
];

const workflowStats = [
  { label: "Signal confidence", value: "78%", tone: "text-emerald-300" },
  { label: "Open risk status", value: "Stable", tone: "text-cyan-200" },
  { label: "Alert source", value: "TradingView", tone: "text-blue-200" },
];

function LandingButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300 px-6 text-sm font-semibold text-slate-950 shadow-[0_18px_55px_rgba(34,211,238,0.2)] transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_24px_70px_rgba(34,211,238,0.3)]"
          : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
      }
    >
      {children}
    </Link>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_24px_90px_rgba(2,8,23,0.45)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-400 md:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute right-[-12rem] top-1/4 h-[32rem] w-[32rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-20rem] left-[-12rem] h-[36rem] w-[36rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_74%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 md:px-8">
        <Link href="/" className="group">
          <div className="text-lg font-semibold tracking-tight text-white">
            {publicConfig.appName}
          </div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/70 transition group-hover:text-cyan-200">
            {publicConfig.appDomain}
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#risk" className="transition hover:text-white">
            Risk
          </a>
          <a href="#security" className="transition hover:text-white">
            Security
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
          >
            Subscribe
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-14 md:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-28 lg:pt-20">
        <div>
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Premium trading process infrastructure
          </div>
          <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white md:text-7xl">
            AI-Assisted Trading Operations, Built for Discipline.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            Track signals, manage risk, journal trades, monitor TradingView
            alerts, and build a repeatable trading process from one clean
            dashboard.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LandingButton href="/login">Login</LandingButton>
            <LandingButton href="/pricing" variant="secondary">
              Subscribe
            </LandingButton>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {workflowStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur"
              >
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className={`mt-2 text-lg font-semibold ${stat.tone}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="relative overflow-hidden p-4">
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="rounded-[1.45rem] border border-slate-800 bg-slate-950/90 p-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Operations command
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Discipline dashboard
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Risk stable
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Daily P/L", "Open trades", "Alerts"].map((label, index) => (
                <div key={label} className="rounded-2xl bg-white/[0.045] p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {["$1,240", "4", "12"][index]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-sm text-cyan-200">NASDAQ:AAPL</p>
                <p className="text-xs text-slate-500">TradingView alert stream</p>
              </div>
              <div className="flex h-44 items-end gap-1">
                {[28, 42, 38, 58, 46, 62, 74, 67, 82, 76, 92, 80, 88, 96, 84, 90, 102, 98].map(
                  (height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className={`flex-1 rounded-t ${
                        index % 4 === 0 ? "bg-rose-400/70" : "bg-emerald-300/80"
                      }`}
                      style={{ height }}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["Signal", "Momentum breakout", "78%"],
                ["Journal", "Execution review", "Draft"],
                ["Calendar", "Market prep block", "Today"],
                ["Drive", "Playbook archive", "Open"],
              ].map(([label, title, value]) => (
                <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {label}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-200">{title}</p>
                    <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading
          eyebrow="What AI Trading Ops Does"
          title="Turn market activity into an operating system."
          description="AI Trading Ops gives discretionary traders and small teams a calmer way to track signals, document decisions, monitor risk, and keep execution standards visible."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Capture", "Collect watchlists, alerts, and signal context before decisions blur together."],
            ["Control", "Keep risk limits, daily loss, open positions, and warnings in front of the desk."],
            ["Improve", "Use structured journaling and settings to reinforce a repeatable trading process."],
          ].map(([title, body]) => (
            <GlassCard key={title} className="p-6 transition hover:-translate-y-1 hover:border-cyan-300/30">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading
          eyebrow="Core Features"
          title="Everything needed to run the trading desk cleanly."
          description="A focused feature set for tracking, reviewing, and controlling operations without adding trade execution risk."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featureCards.map((feature) => (
            <GlassCard
              key={feature}
              className="group p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06]"
            >
              <div className="mb-5 h-1.5 w-12 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 opacity-70 transition group-hover:w-16" />
              <h3 className="text-base font-semibold text-white">{feature}</h3>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="risk" className="relative z-10 mx-auto grid max-w-7xl gap-5 px-5 py-20 md:px-8 lg:grid-cols-2">
        <GlassCard className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
            TradingView Integration
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Alerts become structured signals.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Receive TradingView webhook alerts, validate per-user tokens, log
            events, and create signal rows tied to a controlled dashboard
            workflow.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/80">
            Risk Management
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Risk visibility before risk regret.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Track exposure, daily loss, max risk per trade, open positions, and
            warnings so every trading session starts with boundaries.
          </p>
        </GlassCard>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-5 px-5 py-20 md:px-8 lg:grid-cols-3">
        {[
          [
            "Trade Journal",
            "Capture post-trade notes, tags, lessons, and future AI summary fields so process review has a home.",
          ],
          [
            "User Customization",
            "Tune watchlists, strategies, risk limits, dashboard widgets, confidence thresholds, and alert settings.",
          ],
          [
            "Subscription Access",
            "Keep PayPal subscription flows visible while admin approval and temporary login restrictions remain in control.",
          ],
        ].map(([title, body]) => (
          <GlassCard key={title} className="p-7 transition hover:-translate-y-1 hover:border-cyan-300/30">
            <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">{body}</p>
          </GlassCard>
        ))}
      </section>

      <section id="security" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <GlassCard className="overflow-hidden p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                Security and Privacy
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Built so secrets stay server-side.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-400">
                Google service account credentials, OAuth secrets, PayPal
                secrets, access-control logic, and Sheets writes stay behind
                protected server routes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Server-only API routes",
                "Google OAuth login",
                "Admin-controlled access",
                "TradingView webhook tokens",
                "PayPal webhook verification",
                "No autonomous execution",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-medium text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-24 text-center md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
          Final call-to-action
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Build the trading process you can actually repeat.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
          Start with disciplined tracking today. Expand access later when the
          desk is ready for paid users, manual users, and admin-approved users.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <LandingButton href="/login">Login</LandingButton>
          <LandingButton href="/pricing" variant="secondary">
            Subscribe
          </LandingButton>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center text-sm text-slate-500 md:px-8">
        {publicConfig.appName} / {publicConfig.appDomain}
      </footer>
    </main>
  );
}
