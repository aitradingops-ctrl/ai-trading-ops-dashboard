import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui";
import { publicConfig } from "@/lib/public-config";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <>
      <PageHeading
        title="Google Chat"
        description="Open the shared Google Chat space for account questions, trading notes, and admin coordination."
        action={
          <a
            href={publicConfig.googleChatUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Open Google Chat
          </a>
        }
      />

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Shared chat space
        </p>
        <h2 className="mt-3 text-xl font-semibold text-white">
          AI Trading Ops Chat
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Google Chat opens in a new tab so Google can handle account selection
          and permissions directly. Use the same Google account that has access
          to the shared Chat space.
        </p>
        <a
          href={publicConfig.googleChatUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Open Google Chat
        </a>
      </Card>
    </>
  );
}
