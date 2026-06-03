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
import { formatCurrency } from "@/lib/utils";
import type { Trade } from "@/types/models";

const today = new Date().toISOString().slice(0, 10);
const emptyForm = {
  tradeId: "",
  date: today,
  ticker: "",
  direction: "long",
  entry: "",
  stopLoss: "",
  target: "",
  exit: "",
  pnl: "0",
  status: "planned",
  lesson: "",
};

export function TradesManager({ initialTrades }: { initialTrades: Trade[] }) {
  const [trades, setTrades] = useState(initialTrades);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refresh() {
    const response = await fetch("/api/trades");
    const payload = await response.json();

    if (response.ok) {
      setTrades(payload.data ?? []);
    }
  }

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save trade.");
        return;
      }

      setForm(emptyForm);
      await refresh();
    });
  }

  return (
    <Card>
      <CardHeader
        title="Trade journal table"
        description="Track planned, open, and closed trades. Execution is intentionally out of scope."
      />
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Date">
          <Input
            type="date"
            value={form.date}
            onChange={(event) => updateForm("date", event.target.value)}
          />
        </Field>
        <Field label="Ticker">
          <Input
            value={form.ticker}
            onChange={(event) => updateForm("ticker", event.target.value)}
            placeholder="SPY"
          />
        </Field>
        <Field label="Direction">
          <Select
            value={form.direction}
            onChange={(event) => updateForm("direction", event.target.value)}
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(event) => updateForm("status", event.target.value)}
          >
            <option value="planned">Planned</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </Field>
        <Field label="Entry">
          <Input
            value={form.entry}
            onChange={(event) => updateForm("entry", event.target.value)}
          />
        </Field>
        <Field label="Stop loss">
          <Input
            value={form.stopLoss}
            onChange={(event) => updateForm("stopLoss", event.target.value)}
          />
        </Field>
        <Field label="Target">
          <Input
            value={form.target}
            onChange={(event) => updateForm("target", event.target.value)}
          />
        </Field>
        <Field label="Exit">
          <Input
            value={form.exit}
            onChange={(event) => updateForm("exit", event.target.value)}
          />
        </Field>
        <Field label="P/L">
          <Input
            value={form.pnl}
            onChange={(event) => updateForm("pnl", event.target.value)}
          />
        </Field>
        <div className="md:col-span-3">
          <Field label="Lesson">
            <Textarea
              value={form.lesson}
              onChange={(event) => updateForm("lesson", event.target.value)}
              placeholder="What did this trade teach us?"
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
            {isPending ? "Saving..." : "Save trade"}
          </Button>
          {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        </div>
      </div>

      <div className="px-4 pb-4 md:hidden">
        <DataCardList>
          {trades.map((trade) => (
            <DataCard key={trade.tradeId}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-base font-semibold text-cyan-200">
                    {trade.ticker}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{trade.date}</p>
                </div>
                <Badge tone={trade.status === "open" ? "green" : "slate"}>
                  {trade.status}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3">
                <DataCardRow label="Direction" value={trade.direction} />
                <DataCardRow label="Entry" value={trade.entry} />
                <DataCardRow label="Stop" value={trade.stopLoss} />
                <DataCardRow label="Target" value={trade.target} />
                <DataCardRow label="Exit" value={trade.exit || "Open"} />
                <DataCardRow
                  label="P/L"
                  value={
                    <span className={Number(trade.pnl) >= 0 ? "text-emerald-300" : "text-rose-300"}>
                      {formatCurrency(trade.pnl)}
                    </span>
                  }
                />
                <DataCardRow label="Lesson" value={trade.lesson || "No lesson recorded"} className="items-start" />
              </div>
            </DataCard>
          ))}
        </DataCardList>
      </div>

      <TableShell>
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="hidden border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500 md:table-header-group">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Ticker</th>
              <th className="px-5 py-3">Direction</th>
              <th className="px-5 py-3">Entry</th>
              <th className="px-5 py-3">Stop</th>
              <th className="px-5 py-3">Target</th>
              <th className="px-5 py-3">Exit</th>
              <th className="px-5 py-3">P/L</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Lesson</th>
            </tr>
          </thead>
          <tbody className="hidden divide-y divide-slate-800 md:table-row-group">
            {trades.map((trade) => (
              <tr key={trade.tradeId} className="text-slate-300">
                <td className="px-5 py-4 text-slate-500">{trade.date}</td>
                <td className="px-5 py-4 font-mono text-cyan-200">{trade.ticker}</td>
                <td className="px-5 py-4">{trade.direction}</td>
                <td className="px-5 py-4">{trade.entry}</td>
                <td className="px-5 py-4">{trade.stopLoss}</td>
                <td className="px-5 py-4">{trade.target}</td>
                <td className="px-5 py-4">{trade.exit || "Open"}</td>
                <td className="px-5 py-4">
                  <span
                    className={
                      Number(trade.pnl) >= 0 ? "text-emerald-300" : "text-rose-300"
                    }
                  >
                    {formatCurrency(trade.pnl)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={trade.status === "open" ? "green" : "slate"}>
                    {trade.status}
                  </Badge>
                </td>
                <td className="max-w-xs px-5 py-4 text-slate-400">{trade.lesson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </Card>
  );
}
