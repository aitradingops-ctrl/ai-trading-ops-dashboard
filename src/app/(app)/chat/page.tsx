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
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-sm font-semibold text-white">If the space does not appear</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-400">
            <li>1. Open Chat with the same Gmail you used to sign into AI Trading Ops.</li>
            <li>2. The Gmail account must be invited to the Chat space by its owner.</li>
            <li>3. In a new InPrivate tab, Google will not remember prior account selection.</li>
          </ul>
        </div>
        <a
          href={publicConfig.googleChatUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Open Google Chat
        </a>
        <p className="mt-3 break-all text-xs text-slate-500">{publicConfig.googleChatUrl}</p>
      </Card>
    </>
  );
}
