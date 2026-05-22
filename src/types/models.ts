export type UserRole = "admin" | "paid_user" | "manual_user" | "suspended";

export type AccessType = "paypal_subscription" | "manual_grant" | "admin" | "";

export type AccessStatus = "active" | "inactive" | "suspended";

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "suspended"
  | "payment_failed"
  | "payment_completed"
  | "inactive"
  | "";

export type Direction = "buy" | "sell" | "long" | "short" | "neutral";

export type SignalStatus = "new" | "watching" | "entered" | "ignored" | "closed";

export type TradeStatus = "open" | "closed" | "planned" | "cancelled";

export interface UserRecord {
  userEmail: string;
  fullName: string;
  role: UserRole;
  accessStatus: AccessStatus;
  accessType: AccessType;
  paypalSubscriptionId: string;
  paypalCustomerEmail: string;
  subscriptionStatus: SubscriptionStatus;
  accessExpiresAt: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface UserSettingRecord {
  userEmail: string;
  settingKey: string;
  settingValue: string;
  updatedAt: string;
}

export interface UserSettings {
  preferredWatchlistTickers: string;
  tradingStrategies: string;
  riskLimits: string;
  maxDailyLoss: string;
  maxPositionSize: string;
  alertThresholds: string;
  dashboardWidgets: string;
  defaultConfidenceScoreThreshold: string;
  preferredNotificationEmail: string;
  customCategories: string;
  customTags: string;
  customNotes: string;
  defaultTradingViewSymbol: string;
  tradingViewWebhookToken: string;
  preferredChartTheme: "dark" | "light";
  preferredChartInterval: string;
}

export interface WatchlistItem {
  userEmail: string;
  ticker: string;
  assetType: string;
  sector: string;
  strategy: string;
  active: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Signal {
  signalId: string;
  userEmail: string;
  timestamp: string;
  ticker: string;
  exchange: string;
  price: string;
  direction: Direction;
  setupType: string;
  confidenceScore: string;
  riskRating: string;
  notes: string;
  status: SignalStatus;
  source: string;
}

export interface Trade {
  tradeId: string;
  userEmail: string;
  date: string;
  ticker: string;
  direction: Direction;
  entry: string;
  stopLoss: string;
  target: string;
  exit: string;
  pnl: string;
  status: TradeStatus;
  lesson: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskLog {
  riskId: string;
  userEmail: string;
  timestamp: string;
  exposure: string;
  dailyLoss: string;
  maxRiskPerTrade: string;
  openPositions: string;
  warnings: string;
  status: string;
}

export interface AlertLog {
  alertId: string;
  userEmail: string;
  timestamp: string;
  ticker: string;
  eventType: string;
  message: string;
  source: string;
  payload: string;
}

export interface JournalEntry {
  journalId: string;
  userEmail: string;
  date: string;
  ticker: string;
  category: string;
  tags: string;
  content: string;
  aiSummary: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardNote {
  userEmail: string;
  metricKey: string;
  metricValue: string;
  updatedAt: string;
}

export interface TradingViewWebhookPayload {
  ticker: string;
  exchange?: string;
  price?: string | number;
  time?: string;
  strategy?: string;
  direction: Direction;
  confidenceScore?: string | number;
  notes?: string;
  webhookToken: string;
  userEmail?: string;
}

export interface AccessDecision {
  hasAccess: boolean;
  reason: string;
  user: UserRecord | null;
  isAdmin: boolean;
}

export type SheetTab =
  | "Config"
  | "Users"
  | "User_Settings"
  | "Watchlist"
  | "Signals"
  | "Trades"
  | "Risk_Log"
  | "Alerts_Log"
  | "Journal"
  | "Dashboard";

export type SheetRow<T> = T & { __rowNumber: number };
