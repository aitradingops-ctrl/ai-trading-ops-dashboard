"use client";

import { useState } from "react";

import { TradingViewChart } from "@/components/tradingview-chart";
import { Button, Input } from "@/components/ui";

export function DashboardChartPanel({
  defaultSymbol,
  theme,
  interval,
}: {
  defaultSymbol: string;
  theme: "dark" | "light";
  interval: string;
}) {
  const [draft, setDraft] = useState(defaultSymbol);
  const [symbol, setSymbol] = useState(defaultSymbol);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="NASDAQ:AAPL"
          aria-label="TradingView symbol"
        />
        <Button type="button" onClick={() => setSymbol(draft)} className="w-full sm:w-auto">
          View ticker
        </Button>
      </div>
      <TradingViewChart
        symbol={symbol}
        theme={theme}
        interval={interval}
        height="clamp(320px, 56vh, 520px)"
      />
    </div>
  );
}
