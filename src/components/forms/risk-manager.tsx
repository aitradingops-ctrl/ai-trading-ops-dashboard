"use client";

import { useState, useTransition } from "react";

import { Badge, Button, Card, CardHeader, Field, Input, TableShell, Textarea } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { RiskLog, Trade } from "@/types/models";

const emptyForm = {
  exposure: "0",
  dailyLoss: "0",
  maxRiskPerTrade: "1%",
  openPositions: "0",
  warnings: "",
  status: "stable",
};

export function RiskManager({
  initialRiskLogs,
  openTrades,
}: {
  initialRiskLogs: RiskLog[];
  openTrades: Trade[];
}) {
  const [logs, setLogs] = useState(initialRiskLogs);
  const [form, setForm] = useState({
    ...emptyForm,
    openPositions: String(openTrades.length),
  });
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refresh() {
    const response = await fetch("/api/risk");
    const payload = await response.json();

    if (response.ok) {
      setLogs(payload.data ?? []);
    }
  }

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save risk log.");
        return;
      }

      setForm(emptyForm);
      await refresh();
    });
  }

  const latest = logs[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white">Current risk status</h2>
        <div className="mt-5 grid gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Exposure</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {latest?.exposure ?? "0"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Daily loss
            </p>
            <p className="mt-2 text-2xl font-semibold text-rose-300">
              {latest?.dailyLoss ?? "0"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Open positions
            </p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">
              {latest?.openPositions ?? openTrades.length}
            </p>
          </div>
          <Badge tone={latest?.status === "stable" ? "green" : "amber"}>
            {latest?.status ?? "derived"}
          </Badge>
          <p className="text-sm leading-6 text-slate-400">
            {latest?.warnings || "No active warnings. Continue monitoring risk limits."}
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Risk log"
          description="Update exposure, daily loss, max risk per trade, open positions, and warnings."
        />
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <Field label="Exposure">
            <Input
              value={form.exposure}
              onChange={(event) => updateForm("exposure", event.target.value)}
            />
          </Field>
          <Field label="Daily loss">
            <Input
              value={form.dailyLoss}
              onChange={(event) => updateForm("dailyLoss", event.target.value)}
            />
          </Field>
          <Field label="Max risk/trade">
            <Input
              value={form.maxRiskPerTrade}
              onChange={(event) => updateForm("maxRiskPerTrade", event.target.value)}
            />
          </Field>
          <Field label="Open positions">
            <Input
              value={form.openPositions}
              onChange={(event) => updateForm("openPositions", event.target.value)}
            />
          </Field>
          <Field label="Status">
            <Input
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value)}
            />
          </Field>
          <div className="md:col-span-3">
            <Field label="Warnings">
              <Textarea
                value={form.warnings}
                onChange={(event) => updateForm("warnings", event.target.value)}
                placeholder="Risk warnings or actions to take"
              />
            </Field>
          </div>
          <div className="flex items-center gap-3 md:col-span-3">
            <Button type="button" disabled={isPending} onClick={submit}>
              {isPending ? "Saving..." : "Save risk log"}
            </Button>
            {message ? <p className="text-sm text-rose-300">{message}</p> : null}
          </div>
        </div>

        <TableShell>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Exposure</th>
                <th className="px-5 py-3">Daily loss</th>
                <th className="px-5 py-3">Max risk</th>
                <th className="px-5 py-3">Open positions</th>
                <th className="px-5 py-3">Warnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.riskId} className="text-slate-300">
                  <td className="px-5 py-4 text-slate-500">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-5 py-4">{log.exposure}</td>
                  <td className="px-5 py-4 text-rose-300">{log.dailyLoss}</td>
                  <td className="px-5 py-4">{log.maxRiskPerTrade}</td>
                  <td className="px-5 py-4">{log.openPositions}</td>
                  <td className="px-5 py-4">{log.warnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Card>
    </div>
  );
}
