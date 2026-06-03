import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui";
import { publicConfig, getTradingCalendarEmbedUrl } from "@/lib/public-config";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <>
      <PageHeading
        title="Trading Calendar"
        description={`Embedded month view for ${publicConfig.appName} trading operations events.`}
        action={
          <a
            href={publicConfig.tradingCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 sm:w-auto"
          >
            Open in Google Calendar
          </a>
        }
      />

      <Card className="overflow-hidden p-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Calendar ID
              </p>
              <p className="mt-1 break-all font-mono text-xs text-cyan-200">
                {publicConfig.tradingCalendarId}
              </p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
              Month view
            </span>
          </div>
          <iframe
            title={`${publicConfig.appName} Trading Calendar`}
            src={getTradingCalendarEmbedUrl()}
            className="h-[65vh] min-h-[480px] w-full rounded-xl border border-slate-800 bg-white sm:h-[72vh] sm:min-h-[620px]"
          />
        </div>
      </Card>
    </>
  );
}
