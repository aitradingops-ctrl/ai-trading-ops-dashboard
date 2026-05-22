import "server-only";

import { randomUUID } from "crypto";

import {
  appendRow,
  deleteRow,
  readRows,
  stripRowMetadata,
  upsertRow,
} from "@/lib/sheets";
import type {
  AlertLog,
  JournalEntry,
  RiskLog,
  Signal,
  Trade,
  WatchlistItem,
} from "@/types/models";

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeTicker(ticker: string): string {
  return ticker.trim().toUpperCase();
}

function sortNewestFirst<T extends { timestamp?: string; date?: string; createdAt?: string }>(
  rows: T[],
): T[] {
  return [...rows].sort((a, b) => {
    const left = a.timestamp || a.date || a.createdAt || "";
    const right = b.timestamp || b.date || b.createdAt || "";
    return right.localeCompare(left);
  });
}

export async function listWatchlist(email: string): Promise<WatchlistItem[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<WatchlistItem>("Watchlist");

  return rows
    .filter((row) => normalizeEmail(row.userEmail) === userEmail)
    .map(stripRowMetadata)
    .sort((a, b) => a.ticker.localeCompare(b.ticker));
}

export async function upsertWatchlistItem(
  email: string,
  input: Omit<WatchlistItem, "userEmail" | "createdAt" | "updatedAt">,
): Promise<WatchlistItem> {
  const userEmail = normalizeEmail(email);
  const ticker = normalizeTicker(input.ticker);
  const existing = (await listWatchlist(userEmail)).find(
    (item) => item.ticker === ticker,
  );
  const now = nowIso();
  const item: WatchlistItem = {
    userEmail,
    ticker,
    assetType: input.assetType,
    sector: input.sector,
    strategy: input.strategy,
    active: input.active || "true",
    notes: input.notes,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await upsertRow<WatchlistItem>("Watchlist", ["userEmail", "ticker"], item);
  return item;
}

export async function removeWatchlistItem(
  email: string,
  ticker: string,
): Promise<void> {
  const userEmail = normalizeEmail(email);
  const normalizedTicker = normalizeTicker(ticker);
  const rows = await readRows<WatchlistItem>("Watchlist");
  const row = rows.find(
    (candidate) =>
      normalizeEmail(candidate.userEmail) === userEmail &&
      normalizeTicker(candidate.ticker) === normalizedTicker,
  );

  if (row) {
    await deleteRow("Watchlist", row.__rowNumber);
  }
}

export async function listSignals(email: string): Promise<Signal[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<Signal>("Signals");

  return sortNewestFirst(
    rows
      .filter((row) => normalizeEmail(row.userEmail) === userEmail)
      .map(stripRowMetadata),
  );
}

export async function createSignal(
  email: string,
  input: Omit<Signal, "signalId" | "userEmail" | "timestamp" | "source"> & {
    signalId?: string;
    timestamp?: string;
    source?: string;
  },
): Promise<Signal> {
  const signal: Signal = {
    signalId: input.signalId || `sig_${randomUUID()}`,
    userEmail: normalizeEmail(email),
    timestamp: input.timestamp || nowIso(),
    ticker: normalizeTicker(input.ticker),
    exchange: input.exchange || "",
    price: input.price || "",
    direction: input.direction,
    setupType: input.setupType,
    confidenceScore: input.confidenceScore,
    riskRating: input.riskRating,
    notes: input.notes,
    status: input.status || "new",
    source: input.source || "manual",
  };

  await appendRow("Signals", signal);
  return signal;
}

export async function listTrades(email: string): Promise<Trade[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<Trade>("Trades");

  return sortNewestFirst(
    rows
      .filter((row) => normalizeEmail(row.userEmail) === userEmail)
      .map(stripRowMetadata),
  );
}

export async function upsertTrade(
  email: string,
  input: Omit<Trade, "tradeId" | "userEmail" | "createdAt" | "updatedAt"> & {
    tradeId?: string;
  },
): Promise<Trade> {
  const userEmail = normalizeEmail(email);
  const tradeId = input.tradeId || `trd_${randomUUID()}`;
  const existing = (await listTrades(userEmail)).find((trade) => trade.tradeId === tradeId);
  const now = nowIso();
  const trade: Trade = {
    tradeId,
    userEmail,
    date: input.date,
    ticker: normalizeTicker(input.ticker),
    direction: input.direction,
    entry: input.entry,
    stopLoss: input.stopLoss,
    target: input.target,
    exit: input.exit,
    pnl: input.pnl,
    status: input.status,
    lesson: input.lesson,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await upsertRow<Trade>("Trades", ["userEmail", "tradeId"], trade);
  return trade;
}

export async function listRiskLogs(email: string): Promise<RiskLog[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<RiskLog>("Risk_Log");

  return sortNewestFirst(
    rows
      .filter((row) => normalizeEmail(row.userEmail) === userEmail)
      .map(stripRowMetadata),
  );
}

export async function createRiskLog(
  email: string,
  input: Omit<RiskLog, "riskId" | "userEmail" | "timestamp"> & {
    riskId?: string;
    timestamp?: string;
  },
): Promise<RiskLog> {
  const risk: RiskLog = {
    riskId: input.riskId || `risk_${randomUUID()}`,
    userEmail: normalizeEmail(email),
    timestamp: input.timestamp || nowIso(),
    exposure: input.exposure,
    dailyLoss: input.dailyLoss,
    maxRiskPerTrade: input.maxRiskPerTrade,
    openPositions: input.openPositions,
    warnings: input.warnings,
    status: input.status,
  };

  await appendRow("Risk_Log", risk);
  return risk;
}

export async function listJournalEntries(email: string): Promise<JournalEntry[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<JournalEntry>("Journal");

  return sortNewestFirst(
    rows
      .filter((row) => normalizeEmail(row.userEmail) === userEmail)
      .map(stripRowMetadata),
  );
}

export async function createJournalEntry(
  email: string,
  input: Omit<
    JournalEntry,
    "journalId" | "userEmail" | "createdAt" | "updatedAt"
  > & { journalId?: string },
): Promise<JournalEntry> {
  const now = nowIso();
  const entry: JournalEntry = {
    journalId: input.journalId || `jrnl_${randomUUID()}`,
    userEmail: normalizeEmail(email),
    date: input.date,
    ticker: normalizeTicker(input.ticker),
    category: input.category,
    tags: input.tags,
    content: input.content,
    aiSummary: input.aiSummary || "AI summary placeholder. Connect model workflow later.",
    status: input.status || "draft",
    createdAt: now,
    updatedAt: now,
  };

  await appendRow("Journal", entry);
  return entry;
}

export async function logAlert(
  email: string,
  input: Omit<AlertLog, "alertId" | "userEmail" | "timestamp"> & {
    alertId?: string;
    timestamp?: string;
  },
): Promise<AlertLog> {
  const alert: AlertLog = {
    alertId: input.alertId || `alert_${randomUUID()}`,
    userEmail: normalizeEmail(email),
    timestamp: input.timestamp || nowIso(),
    ticker: normalizeTicker(input.ticker || "N/A"),
    eventType: input.eventType,
    message: input.message,
    source: input.source,
    payload: input.payload,
  };

  await appendRow("Alerts_Log", alert);
  return alert;
}

export async function listAlerts(email: string): Promise<AlertLog[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<AlertLog>("Alerts_Log");

  return sortNewestFirst(
    rows
      .filter((row) => normalizeEmail(row.userEmail) === userEmail)
      .map(stripRowMetadata),
  );
}

export async function getDashboardSnapshot(email: string) {
  const [watchlist, signals, trades, riskLogs, alerts] = await Promise.all([
    listWatchlist(email),
    listSignals(email),
    listTrades(email),
    listRiskLogs(email),
    listAlerts(email),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const openTrades = trades.filter((trade) => trade.status === "open");
  const dailyPnl = trades
    .filter((trade) => trade.date.startsWith(today))
    .reduce((sum, trade) => sum + Number(trade.pnl || 0), 0);
  const exposure = openTrades.reduce(
    (sum, trade) => sum + Math.abs(Number(trade.entry || 0)),
    0,
  );
  const latestRisk = riskLogs[0] ?? {
    riskId: "derived",
    userEmail: normalizeEmail(email),
    timestamp: nowIso(),
    exposure: String(exposure),
    dailyLoss: String(Math.min(dailyPnl, 0)),
    maxRiskPerTrade: "1%",
    openPositions: String(openTrades.length),
    warnings: dailyPnl < 0 ? "Monitor daily loss limits." : "No active warnings.",
    status: dailyPnl < 0 ? "watch" : "stable",
  };

  return {
    watchlist,
    signals,
    trades,
    openTrades,
    riskLogs,
    alerts,
    latestRisk,
    metrics: {
      activeWatchlist: watchlist.filter((item) => item.active !== "false").length,
      latestSignalConfidence: signals[0]?.confidenceScore || "0",
      openTrades: openTrades.length,
      dailyPnl,
      exposure,
      alertCount: alerts.length,
    },
  };
}
