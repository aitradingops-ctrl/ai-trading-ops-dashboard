import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-950/70 shadow-[0_18px_80px_rgba(2,8,23,0.28)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-50">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: PropsWithChildren<{
  tone?: "green" | "red" | "amber" | "blue" | "slate";
}>) {
  const tones = {
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    red: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    blue: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    slate: "border-slate-700 bg-slate-900 text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
  }
>) {
  const variants = {
    primary:
      "border-cyan-400/30 bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:outline-cyan-200",
    secondary:
      "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 focus-visible:outline-slate-300",
    danger:
      "border-rose-500/40 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 focus-visible:outline-rose-300",
    ghost:
      "border-transparent bg-transparent text-slate-300 hover:bg-slate-900 focus-visible:outline-slate-300",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-300">
      {label}
      {children}
    </label>
  );
}

export function EmptyState({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
      {children}
    </div>
  );
}

export function TableShell({ children }: PropsWithChildren) {
  return <div className="overflow-x-auto">{children}</div>;
}

export function DataCardList({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}

export function DataCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DataCardRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <div className="text-right text-sm text-slate-200">{value}</div>
    </div>
  );
}
