"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-slate-100">
      <div className="max-w-lg rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm leading-6 text-rose-100">{error.message}</p>
        <Button type="button" className="mt-4" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
