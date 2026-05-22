import "server-only";

import { randomBytes } from "crypto";

import { readRows, stripRowMetadata, upsertRow } from "@/lib/sheets";
import type { UserSettingRecord, UserSettings } from "@/types/models";

export const DEFAULT_USER_SETTINGS = {
  preferredWatchlistTickers: "AAPL, MSFT, NVDA, SPY",
  tradingStrategies: "Momentum Breakout, Pullback, Earnings Continuation",
  riskLimits: "Risk 1% or less per trade; reduce size after two losses.",
  maxDailyLoss: "500",
  maxPositionSize: "5000",
  alertThresholds: "Confidence >= 70, riskRating <= Medium",
  dashboardWidgets: "kpis,chart,risk,signals,alerts,openTrades",
  defaultConfidenceScoreThreshold: "70",
  preferredNotificationEmail: "",
  customCategories: "Execution, Psychology, Setup Quality",
  customTags: "breakout,pullback,earnings,news,risk",
  customNotes: "",
  defaultTradingViewSymbol: "NASDAQ:AAPL",
  tradingViewWebhookToken: "",
  preferredChartTheme: "dark",
  preferredChartInterval: "D",
} satisfies UserSettings;

export const USER_SETTING_KEYS = Object.keys(
  DEFAULT_USER_SETTINGS,
) as Array<keyof UserSettings>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function nowIso(): string {
  return new Date().toISOString();
}

function createWebhookToken(): string {
  return `tv_${randomBytes(24).toString("hex")}`;
}

export async function getUserSettings(email: string): Promise<UserSettings> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<UserSettingRecord>("User_Settings");
  const userRows = rows.filter(
    (row) => row.userEmail.trim().toLowerCase() === userEmail,
  );

  const settings = { ...DEFAULT_USER_SETTINGS };

  for (const row of userRows) {
    if (USER_SETTING_KEYS.includes(row.settingKey as keyof UserSettings)) {
      settings[row.settingKey as keyof UserSettings] = row.settingValue as never;
    }
  }

  if (!settings.tradingViewWebhookToken) {
    settings.tradingViewWebhookToken = createWebhookToken();
    await upsertRow<UserSettingRecord>(
      "User_Settings",
      ["userEmail", "settingKey"],
      {
        userEmail,
        settingKey: "tradingViewWebhookToken",
        settingValue: settings.tradingViewWebhookToken,
        updatedAt: nowIso(),
      },
    );
  }

  return settings;
}

export async function saveUserSettings(
  email: string,
  updates: Partial<UserSettings>,
  options?: { regenerateTradingViewWebhookToken?: boolean },
): Promise<UserSettings> {
  const userEmail = normalizeEmail(email);
  const nextUpdates = { ...updates };

  if (options?.regenerateTradingViewWebhookToken) {
    nextUpdates.tradingViewWebhookToken = createWebhookToken();
  }

  for (const key of USER_SETTING_KEYS) {
    const value = nextUpdates[key];

    if (value === undefined) {
      continue;
    }

    await upsertRow<UserSettingRecord>(
      "User_Settings",
      ["userEmail", "settingKey"],
      {
        userEmail,
        settingKey: key,
        settingValue: String(value),
        updatedAt: nowIso(),
      },
    );
  }

  return getUserSettings(userEmail);
}

export async function getSettingsRowsForUser(
  email: string,
): Promise<UserSettingRecord[]> {
  const userEmail = normalizeEmail(email);
  const rows = await readRows<UserSettingRecord>("User_Settings");

  return rows
    .filter((row) => row.userEmail.trim().toLowerCase() === userEmail)
    .map(stripRowMetadata);
}

export async function findUserEmailByWebhookToken(
  token: string,
): Promise<string | null> {
  if (!token.trim()) {
    return null;
  }

  const rows = await readRows<UserSettingRecord>("User_Settings");
  const match = rows.find(
    (row) =>
      row.settingKey === "tradingViewWebhookToken" &&
      row.settingValue.trim() === token.trim(),
  );

  return match?.userEmail ?? null;
}
