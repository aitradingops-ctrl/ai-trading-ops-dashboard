import { z } from "zod";

const directionSchema = z.enum(["buy", "sell", "long", "short", "neutral"]);

export const watchlistPostSchema = z.object({
  action: z.enum(["upsert", "delete"]).default("upsert"),
  ticker: z.string().trim().min(1, "Ticker is required."),
  assetType: z.string().trim().default("Stock"),
  sector: z.string().trim().default(""),
  strategy: z.string().trim().default(""),
  active: z.string().trim().default("true"),
  notes: z.string().trim().default(""),
});

export const signalPostSchema = z.object({
  timestamp: z.string().trim().optional(),
  ticker: z.string().trim().min(1, "Ticker is required."),
  exchange: z.string().trim().default(""),
  price: z.string().trim().default(""),
  direction: directionSchema,
  setupType: z.string().trim().min(1, "Setup type is required."),
  confidenceScore: z.string().trim().default("0"),
  riskRating: z.string().trim().default("Medium"),
  notes: z.string().trim().default(""),
  status: z.enum(["new", "watching", "entered", "ignored", "closed"]).default("new"),
});

export const tradePostSchema = z.object({
  tradeId: z.string().trim().optional(),
  date: z.string().trim().min(1, "Date is required."),
  ticker: z.string().trim().min(1, "Ticker is required."),
  direction: directionSchema,
  entry: z.string().trim().default(""),
  stopLoss: z.string().trim().default(""),
  target: z.string().trim().default(""),
  exit: z.string().trim().default(""),
  pnl: z.string().trim().default("0"),
  status: z.enum(["open", "closed", "planned", "cancelled"]).default("planned"),
  lesson: z.string().trim().default(""),
});

export const riskPostSchema = z.object({
  exposure: z.string().trim().default("0"),
  dailyLoss: z.string().trim().default("0"),
  maxRiskPerTrade: z.string().trim().default("1%"),
  openPositions: z.string().trim().default("0"),
  warnings: z.string().trim().default(""),
  status: z.string().trim().default("stable"),
});

export const journalPostSchema = z.object({
  date: z.string().trim().min(1, "Date is required."),
  ticker: z.string().trim().min(1, "Ticker is required."),
  category: z.string().trim().default("Post-trade"),
  tags: z.string().trim().default(""),
  content: z.string().trim().min(3, "Journal content is required."),
  aiSummary: z.string().trim().default("AI summary placeholder. Connect model workflow later."),
  status: z.string().trim().default("draft"),
});

export const settingsPostSchema = z.object({
  settings: z.record(z.string(), z.string()).default({}),
  regenerateTradingViewWebhookToken: z.boolean().default(false),
});

export const adminUserPostSchema = z.object({
  userEmail: z.string().trim().email("A valid user email is required."),
  fullName: z.string().trim().default(""),
  role: z.enum(["admin", "paid_user", "manual_user", "suspended"]).optional(),
  accessStatus: z.enum(["active", "inactive", "suspended"]).optional(),
  accessType: z.enum(["paypal_subscription", "manual_grant", "admin", ""]).optional(),
  accessExpiresAt: z.string().trim().default(""),
  notes: z.string().trim().default(""),
});

export const tradingViewWebhookSchema = z.object({
  ticker: z.string().trim().min(1, "Ticker is required."),
  exchange: z.string().trim().default(""),
  price: z.union([z.string(), z.number()]).optional().default(""),
  time: z.string().trim().optional(),
  strategy: z.string().trim().default("TradingView Alert"),
  direction: directionSchema,
  confidenceScore: z.union([z.string(), z.number()]).optional().default("0"),
  notes: z.string().trim().default("TradingView alert triggered"),
  webhookToken: z.string().trim().min(12, "Webhook token is required."),
  userEmail: z.string().trim().email().optional(),
});
