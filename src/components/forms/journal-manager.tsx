"use client";

import { useState, useTransition } from "react";

import { Badge, Button, Card, CardHeader, Field, Input, TableShell, Textarea } from "@/components/ui";
import type { JournalEntry } from "@/types/models";

const today = new Date().toISOString().slice(0, 10);
const emptyForm = {
  date: today,
  ticker: "",
  category: "Post-trade",
  tags: "",
  content: "",
  aiSummary: "AI summary placeholder. Connect model workflow later.",
  status: "draft",
};

export function JournalManager({
  initialEntries,
}: {
  initialEntries: JournalEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refresh() {
    const response = await fetch("/api/journal");
    const payload = await response.json();

    if (response.ok) {
      setEntries(payload.data ?? []);
    }
  }

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save journal entry.");
        return;
      }

      setForm(emptyForm);
      await refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white">Post-trade notes</h2>
        <div className="mt-5 grid gap-4">
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
              placeholder="TSLA"
            />
          </Field>
          <Field label="Category">
            <Input
              value={form.category}
              onChange={(event) => updateForm("category", event.target.value)}
            />
          </Field>
          <Field label="Tags">
            <Input
              value={form.tags}
              onChange={(event) => updateForm("tags", event.target.value)}
              placeholder="execution,psychology"
            />
          </Field>
          <Field label="Content">
            <Textarea
              value={form.content}
              onChange={(event) => updateForm("content", event.target.value)}
              placeholder="What happened, what did we learn, what changes next?"
            />
          </Field>
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
            AI summary placeholder is stored now. Autonomous trade execution is
            intentionally not implemented.
          </div>
          <Button type="button" disabled={isPending || !form.ticker} onClick={submit}>
            {isPending ? "Saving..." : "Save journal entry"}
          </Button>
          {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Journal"
          description="Structured trade reflections with future AI summary slot."
        />
        <TableShell>
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Ticker</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">AI summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {entries.map((entry) => (
                <tr key={entry.journalId} className="align-top text-slate-300">
                  <td className="px-5 py-4 text-slate-500">{entry.date}</td>
                  <td className="px-5 py-4 font-mono text-cyan-200">{entry.ticker}</td>
                  <td className="px-5 py-4">{entry.category}</td>
                  <td className="px-5 py-4">
                    <Badge tone="slate">{entry.tags || "untagged"}</Badge>
                  </td>
                  <td className="max-w-sm px-5 py-4 leading-6">{entry.content}</td>
                  <td className="max-w-sm px-5 py-4 leading-6 text-slate-400">
                    {entry.aiSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Card>
    </div>
  );
}
