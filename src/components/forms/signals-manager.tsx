"use client";

import { useState, useTransition } from "react";

import {
  Badge,
  Button,
  Card,
  CardHeader,
  DataCard,
  DataCardList,
  DataCardRow,
  Field,
  Input,
  Select,
  TableShell,
  Textarea,
} from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { Signal, UserSettings } from "@/types/models";

const emptyForm = {
  ticker: "",
  exchange: "",
  price: "",
  direction: "buy",
  setupType: "Momentum Breakout",
  confidenceScore: "70",
  riskRating: "Medium",
  notes: "",
  status: "new",
};

export function SignalsManager({
  initialSignals,
  settings,
}: {
  initialSignals: Signal[];
  settings: UserSettings;
}) {
  const [signals, setSignals] = useState(initialSignals);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refresh() {
    const response = await fetch("/api/signals");
    const payload = await response.json();

    if (response.ok) {
      setSignals(payload.data ?? []);
    }
  }

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save signal.");
        return;
      }

      setForm(emptyForm);
      await refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader
          title="Signals"
          description="Manual signals and TradingView alert webhook signals land in this table."
        />
        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Ticker">
            <Input
              value={form.ticker}
              onChange={(event) => updateForm("ticker", event.target.value)}
              placeholder="AAPL"
            />
          </Field>
          <Field label="Exchange">
            <Input
              value={form.exchange}
              onChange={(event) => updateForm("exchange", event.target.value)}
              placeholder="NASDAQ"
            />
          </Field>
          <Field label="Direction">
            <Select
              value={form.direction}
              onChange={(event) => updateForm("direction", event.target.value)}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
              <option value="neutral">Neutral</option>
            </Select>
          </Field>
          <Field label="Confidence">
            <Input
              type="number"
              value={form.confidenceScore}
              onChange={(event) => updateForm("confidenceScore", event.target.value)}
            />
          </Field>
          <Field label="Setup type">
            <Input
              value={form.setupType}
              onChange={(event) => updateForm("setupType", event.target.value)}
            />
          </Field>
          <Field label="Price">
            <Input
              value={form.price}
              onChange={(event) => updateForm("price", event.target.value)}
            />
          </Field>
          <Field label="Risk">
            <Input
              value={form.riskRating}
              onChange={(event) => updateForm("riskRating", event.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value)}
            >
              <option value="new">New</option>
              <option value="watching">Watching</option>
              <option value="entered">Entered</option>
              <option value="ignored">Ignored</option>
              <option value="closed">Closed</option>
            </Select>
          </Field>
          <div className="md:col-span-4">
            <Field label="Notes">
              <Textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                placeholder="Signal rationale"
              />
            </Field>
          </div>
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 sm:flex-row sm:items-center">
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={isPending || !form.ticker}
              onClick={submit}
            >
              {isPending ? "Saving..." : "Save signal"}
            </Button>
            {message ? <p className="text-sm text-rose-300">{message}</p> : null}
          </div>
        </div>

        <div className="px-4 pb-4 md:hidden">
          <DataCardList>
            {signals.map((signal) => (
              <DataCard key={signal.signalId}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-base font-semibold text-cyan-200">
                      {signal.ticker}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDateTime(signal.timestamp)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      Number(signal.confidenceScore) >=
                      Number(settings.defaultConfidenceScoreThreshold)
                        ? "green"
                        : "amber"
                    }
                  >
                    {signal.confidenceScore}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3">
                  <DataCardRow label="Direction" value={signal.direction} />
                  <DataCardRow label="Setup" value={signal.setupType} />
                  <DataCardRow label="Risk" value={signal.riskRating} />
                  <DataCardRow label="Status" value={<Badge tone="blue">{signal.status}</Badge>} />
                  <DataCardRow label="Source" value={signal.source} />
                </div>
              </DataCard>
            ))}
          </DataCardList>
        </div>

        <TableShell>
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="hidden border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500 md:table-header-group">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Ticker</th>
                <th className="px-5 py-3">Direction</th>
                <th className="px-5 py-3">Setup</th>
                <th className="px-5 py-3">Confidence</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Source</th>
              </tr>
            </thead>
            <tbody className="hidden divide-y divide-slate-800 md:table-row-group">
              {signals.map((signal) => (
                <tr key={signal.signalId} className="text-slate-300">
                  <td className="px-5 py-4 text-slate-500">
                    {formatDateTime(signal.timestamp)}
                  </td>
                  <td className="px-5 py-4 font-mono text-cyan-200">{signal.ticker}</td>
                  <td className="px-5 py-4">{signal.direction}</td>
                  <td className="px-5 py-4">{signal.setupType}</td>
                  <td className="px-5 py-4">
                    <Badge
                      tone={
                        Number(signal.confidenceScore) >=
                        Number(settings.defaultConfidenceScoreThreshold)
                          ? "green"
                          : "amber"
                      }
                    >
                      {signal.confidenceScore}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">{signal.riskRating}</td>
                  <td className="px-5 py-4">
                    <Badge tone="blue">{signal.status}</Badge>
                  </td>
                  <td className="px-5 py-4">{signal.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Card>

      <Card className="p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">TradingView webhook</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Add your token to every TradingView alert payload. Requests without a
          valid token are rejected before creating a signal.
        </p>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">
            User token
          </p>
          <code className="break-all text-xs text-cyan-200">
            {settings.tradingViewWebhookToken}
          </code>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-black/50 p-3 text-[11px] leading-5 text-slate-300 sm:p-4 sm:text-xs">
{`{
  "ticker": "{{ticker}}",
  "exchange": "{{exchange}}",
  "price": "{{close}}",
  "time": "{{time}}",
  "strategy": "Momentum Breakout",
  "direction": "buy",
  "confidenceScore": 75,
  "notes": "TradingView alert triggered",
  "webhookToken": "${settings.tradingViewWebhookToken}"
}`}
        </pre>
      </Card>
    </div>
  );
}
