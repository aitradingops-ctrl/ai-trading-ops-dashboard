import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const defaultAdminEmail = "aitradingops@gmail.com";

function loadDotEnvLocal() {
  const envPath = path.join(root, ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^"|"$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnvLocal();

const SHEET_HEADERS = {
  Config: ["key", "value", "updatedAt"],
  Users: [
    "userEmail",
    "fullName",
    "role",
    "accessStatus",
    "accessType",
    "paypalSubscriptionId",
    "paypalCustomerEmail",
    "subscriptionStatus",
    "accessExpiresAt",
    "createdAt",
    "updatedAt",
    "notes",
  ],
  User_Settings: ["userEmail", "settingKey", "settingValue", "updatedAt"],
  Watchlist: [
    "userEmail",
    "ticker",
    "assetType",
    "sector",
    "strategy",
    "active",
    "notes",
    "createdAt",
    "updatedAt",
  ],
  Signals: [
    "signalId",
    "userEmail",
    "timestamp",
    "ticker",
    "exchange",
    "price",
    "direction",
    "setupType",
    "confidenceScore",
    "riskRating",
    "notes",
    "status",
    "source",
  ],
  Trades: [
    "tradeId",
    "userEmail",
    "date",
    "ticker",
    "direction",
    "entry",
    "stopLoss",
    "target",
    "exit",
    "pnl",
    "status",
    "lesson",
    "createdAt",
    "updatedAt",
  ],
  Risk_Log: [
    "riskId",
    "userEmail",
    "timestamp",
    "exposure",
    "dailyLoss",
    "maxRiskPerTrade",
    "openPositions",
    "warnings",
    "status",
  ],
  Alerts_Log: [
    "alertId",
    "userEmail",
    "timestamp",
    "ticker",
    "eventType",
    "message",
    "source",
    "payload",
  ],
  Journal: [
    "journalId",
    "userEmail",
    "date",
    "ticker",
    "category",
    "tags",
    "content",
    "aiSummary",
    "status",
    "createdAt",
    "updatedAt",
  ],
  Dashboard: ["userEmail", "metricKey", "metricValue", "updatedAt"],
};

function required(name) {
  if (!process.env[name]) {
    throw new Error(`Missing ${name}. Add it to .env.local or the environment.`);
  }

  return process.env[name];
}

function columnLetter(index) {
  let letter = "";
  let current = index;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    current = Math.floor((current - 1) / 26);
  }

  return letter;
}

function quoteTab(tab) {
  return `'${tab.replace(/'/g, "''")}'`;
}

function replacePlaceholders(value) {
  if (typeof value === "string") {
    return value.replaceAll(
      "__APP_ADMIN_EMAIL__",
      process.env.APP_ADMIN_EMAIL || defaultAdminEmail,
    );
  }

  return value;
}

const auth = new google.auth.JWT({
  email: required("GOOGLE_CLIENT_EMAIL"),
  key: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = required("GOOGLE_SHEET_ID");
const seed = JSON.parse(
  fs.readFileSync(path.join(root, "data", "sample-seed.json"), "utf8"),
);

const metadata = await sheets.spreadsheets.get({
  spreadsheetId,
  fields: "sheets.properties(sheetId,title)",
});
const existingTabs = new Set(
  metadata.data.sheets?.map((sheet) => sheet.properties?.title).filter(Boolean),
);

for (const [tab, headers] of Object.entries(SHEET_HEADERS)) {
  if (!existingTabs.has(tab)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tab } } }],
      },
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${quoteTab(tab)}!A1:${columnLetter(headers.length)}1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [headers],
    },
  });

  const rows = seed[tab] ?? [];

  if (rows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${quoteTab(tab)}!A:${columnLetter(headers.length)}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: rows.map((row) => headers.map((header) => replacePlaceholders(row[header] ?? ""))),
      },
    });
  }
}

console.log("Google Sheet tabs, headers, and sample rows seeded.");
