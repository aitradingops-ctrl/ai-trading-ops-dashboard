import { DashboardChartPanel } from "@/components/forms/dashboard-chart-panel";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { Badge, Card, CardHeader, TableShell } from "@/components/ui";
import { requirePageAccess } from "@/lib/page-guards";
import { publicConfig } from "@/lib/public-config";
import { getUserSettings } from "@/lib/settings-service";
import { getDashboardSnapshot } from "@/lib/trading-data-service";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const context = await requirePageAccess();
  const [settings, snapshot] = await Promise.all([
    getUserSettings(context.sessionUser.email),
    getDashboardSnapshot(context.sessionUser.email),
  ]);
  const visibleWidgets = settings.dashboardWidgets
    .split(",")
    .map((widget) => widget.trim());

  return (
    <>
      <PageHeading
        title={`${publicConfig.appName} dashboard`}
        description="KPIs, current risk status, latest signals, alerts, open trades, project resources, and a TradingView chart configured from your settings."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Quick action
          </p>
          <h2 className="mt-3 text-lg font-semibold text-white">Project Drive</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Open the shared Google Drive folder for {publicConfig.appName}
            operations files and admin resources.
          </p>
          <a
            href={publicConfig.projectDriveUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Open Project Drive
          </a>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Trading Calendar
          </p>
          <h2 className="mt-3 text-lg font-semibold text-white">
            Month view and events
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Review scheduled trading operations events, reminders, and market
            prep items.
          </p>
          <a
            href="/calendar"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Open Trading Calendar
          </a>
        </Card>
      </div>

      {visibleWidgets.includes("kpis") ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Daily P/L"
            value={formatCurrency(snapshot.metrics.dailyPnl)}
            tone={snapshot.metrics.dailyPnl >= 0 ? "green" : "red"}
            helper="Calculated from today's trade rows"
          />
          <MetricCard
            label="Open trades"
            value={String(snapshot.metrics.openTrades)}
            tone="blue"
            helper="Current open trade count"
          />
          <MetricCard
            label="Risk exposure"
            value={formatCurrency(snapshot.metrics.exposure)}
            helper="Derived from open entries unless Risk_Log overrides it"
          />
          <MetricCard
            label="Latest confidence"
            value={`${snapshot.metrics.latestSignalConfidence}%`}
            tone="blue"
            helper={`Threshold: ${settings.defaultConfidenceScoreThreshold}%`}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {visibleWidgets.includes("chart") ? (
          <Card className="p-5">
            <CardHeader
              title="TradingView advanced chart"
              description="Default symbol, theme, and interval come from your settings."
            />
            <div className="pt-5">
              <DashboardChartPanel
                defaultSymbol={settings.defaultTradingViewSymbol}
                theme={settings.preferredChartTheme}
                interval={settings.preferredChartInterval}
              />
            </div>
          </Card>
        ) : null}

        <div className="grid gap-6">
          {visibleWidgets.includes("risk") ? (
            <Card className="p-5">
              <h2 className="text-base font-semibold text-white">Current risk</h2>
              <div className="mt-4 grid gap-3">
                <Badge
                  tone={snapshot.latestRisk.status === "stable" ? "green" : "amber"}
                >
                  {snapshot.latestRisk.status}
                </Badge>
                <p className="text-sm leading-6 text-slate-400">
                  {snapshot.latestRisk.warnings}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-slate-500">Daily loss</p>
                    <p className="mt-1 font-semibold text-rose-300">
                      {snapshot.latestRisk.dailyLoss}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-slate-500">Open positions</p>
                    <p className="mt-1 font-semibold text-cyan-200">
                      {snapshot.latestRisk.openPositions}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {visibleWidgets.includes("alerts") ? (
            <Card>
              <CardHeader title="Alerts summary" description="Latest webhook and system events." />
              <div className="grid gap-3 p-5">
                {snapshot.alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.alertId}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone="blue">{alert.source}</Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(alert.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
                  </div>
                ))}
                {snapshot.alerts.length === 0 ? (
                  <p className="text-sm text-slate-500">No alerts logged yet.</p>
                ) : null}
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {visibleWidgets.includes("signals") ? (
          <Card>
            <CardHeader title="Latest signals" description="Most recent signal rows." />
            <TableShell>
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Ticker</th>
                    <th className="px-5 py-3">Direction</th>
                    <th className="px-5 py-3">Confidence</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {snapshot.signals.slice(0, 6).map((signal) => (
                    <tr key={signal.signalId} className="text-slate-300">
                      <td className="px-5 py-4 font-mono text-cyan-200">
                        {signal.ticker}
                      </td>
                      <td className="px-5 py-4">{signal.direction}</td>
                      <td className="px-5 py-4">{signal.confidenceScore}</td>
                      <td className="px-5 py-4">
                        <Badge tone="slate">{signal.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          </Card>
        ) : null}

        {visibleWidgets.includes("openTrades") ? (
          <Card>
            <CardHeader title="Open trades" description="Open positions from Trades." />
            <TableShell>
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Ticker</th>
                    <th className="px-5 py-3">Entry</th>
                    <th className="px-5 py-3">Stop</th>
                    <th className="px-5 py-3">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {snapshot.openTrades.map((trade) => (
                    <tr key={trade.tradeId} className="text-slate-300">
                      <td className="px-5 py-4 font-mono text-cyan-200">
                        {trade.ticker}
                      </td>
                      <td className="px-5 py-4">{trade.entry}</td>
                      <td className="px-5 py-4">{trade.stopLoss}</td>
                      <td className="px-5 py-4">{trade.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          </Card>
        ) : null}
      </div>
    </>
  );
}
