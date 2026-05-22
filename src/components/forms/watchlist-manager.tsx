"use client";

import { useState, useTransition } from "react";

import {
  TradingViewChart,
  TradingViewWatchlistWidget,
} from "@/components/tradingview-chart";
import { Badge, Button, Card, CardHeader, Field, Input, Select, TableShell, Textarea } from "@/components/ui";
import type { UserSettings, WatchlistItem } from "@/types/models";

const emptyForm = {
  ticker: "",
  assetType: "Stock",
  sector: "",
  strategy: "",
  active: "true",
  notes: "",
};

export function WatchlistManager({
  initialItems,
  settings,
}: {
  initialItems: WatchlistItem[];
  settings: UserSettings;
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [chartSymbol, setChartSymbol] = useState(
    initialItems[0]?.ticker || settings.defaultTradingViewSymbol,
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refresh() {
    const response = await fetch("/api/watchlist");
    const payload = await response.json();

    if (response.ok) {
      setItems(payload.data ?? []);
    }
  }

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save ticker.");
        return;
      }

      setForm(emptyForm);
      await refresh();
    });
  }

  function remove(ticker: string) {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ticker }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to remove ticker.");
        return;
      }

      await refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader
          title="Watchlist"
          description="Add, edit, remove, and launch TradingView charts for tracked tickers."
        />
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <Field label="Ticker">
            <Input
              value={form.ticker}
              onChange={(event) => updateForm("ticker", event.target.value)}
              placeholder="NVDA"
            />
          </Field>
          <Field label="Asset type">
            <Input
              value={form.assetType}
              onChange={(event) => updateForm("assetType", event.target.value)}
              placeholder="Stock, ETF, Crypto"
            />
          </Field>
          <Field label="Sector">
            <Input
              value={form.sector}
              onChange={(event) => updateForm("sector", event.target.value)}
              placeholder="Technology"
            />
          </Field>
          <Field label="Strategy">
            <Input
              value={form.strategy}
              onChange={(event) => updateForm("strategy", event.target.value)}
              placeholder="Momentum Breakout"
            />
          </Field>
          <Field label="Active">
            <Select
              value={form.active}
              onChange={(event) => updateForm("active", event.target.value)}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </Field>
          <div className="md:col-span-3">
            <Field label="Notes">
              <Textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                placeholder="What are we watching for?"
              />
            </Field>
          </div>
          <div className="flex items-center gap-3 md:col-span-3">
            <Button type="button" disabled={isPending || !form.ticker} onClick={submit}>
              {isPending ? "Saving..." : "Save ticker"}
            </Button>
            {message ? <p className="text-sm text-rose-300">{message}</p> : null}
          </div>
        </div>

        <TableShell>
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Ticker</th>
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Sector</th>
                <th className="px-5 py-3">Strategy</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.ticker} className="text-slate-300">
                  <td className="px-5 py-4 font-mono text-cyan-200">{item.ticker}</td>
                  <td className="px-5 py-4">{item.assetType}</td>
                  <td className="px-5 py-4">{item.sector}</td>
                  <td className="px-5 py-4">{item.strategy}</td>
                  <td className="px-5 py-4">
                    <Badge tone={item.active === "false" ? "slate" : "green"}>
                      {item.active === "false" ? "Inactive" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setChartSymbol(item.ticker)}
                      >
                        View Chart
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setForm({
                            ticker: item.ticker,
                            assetType: item.assetType,
                            sector: item.sector,
                            strategy: item.strategy,
                            active: item.active,
                            notes: item.notes,
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button type="button" variant="danger" onClick={() => remove(item.ticker)}>
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Card>

      <div className="grid gap-6">
        <Card className="p-4">
          <h2 className="mb-4 text-base font-semibold text-white">
            TradingView chart: {chartSymbol}
          </h2>
          <TradingViewChart
            symbol={chartSymbol}
            theme={settings.preferredChartTheme}
            interval={settings.preferredChartInterval}
            height={360}
          />
        </Card>
        <Card className="p-4">
          <h2 className="mb-4 text-base font-semibold text-white">
            TradingView watchlist widget
          </h2>
          <TradingViewWatchlistWidget
            symbols={items.map((item) => item.ticker)}
            theme={settings.preferredChartTheme}
          />
        </Card>
      </div>
    </div>
  );
}
