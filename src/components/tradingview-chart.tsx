"use client";

import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/utils";

interface TradingViewChartProps {
  symbol: string;
  theme?: "dark" | "light";
  interval?: string;
  height?: number;
  className?: string;
}

function normalizeSymbol(symbol: string): string {
  if (!symbol.trim()) {
    return "NASDAQ:AAPL";
  }

  return symbol.includes(":") ? symbol.trim().toUpperCase() : `NASDAQ:${symbol.trim().toUpperCase()}`;
}

export function TradingViewChart({
  symbol,
  theme = "dark",
  interval = "D",
  height = 520,
  className,
}: TradingViewChartProps) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const containerId = `tv_chart_${generatedId}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: normalizeSymbol(symbol),
      interval,
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      container_id: containerId,
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [containerId, interval, symbol, theme]);

  return (
    <div
      className={cn("overflow-hidden rounded-2xl border border-slate-800 bg-slate-950", className)}
      style={{ height }}
    >
      <div id={containerId} ref={containerRef} className="h-full w-full" />
    </div>
  );
}

export function TradingViewSymbolWidget({
  symbol,
  theme = "dark",
}: {
  symbol: string;
  theme?: "dark" | "light";
}) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: normalizeSymbol(symbol),
      width: "100%",
      locale: "en",
      colorTheme: theme,
      isTransparent: true,
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [generatedId, symbol, theme]);

  return <div ref={containerRef} className="min-h-40" />;
}

export function TradingViewWatchlistWidget({
  symbols,
  theme = "dark",
}: {
  symbols: string[];
  theme?: "dark" | "light";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      dateRange: "12M",
      showChart: false,
      locale: "en",
      width: "100%",
      height: "420",
      isTransparent: true,
      showSymbolLogo: true,
      tabs: [
        {
          title: "Watchlist",
          symbols: symbols.slice(0, 12).map((symbol) => ({
            s: normalizeSymbol(symbol),
            d: normalizeSymbol(symbol),
          })),
        },
      ],
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [symbols, theme]);

  return <div ref={containerRef} className="min-h-[420px]" />;
}
