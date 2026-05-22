import "server-only";

import { google, type sheets_v4 } from "googleapis";

import { getEnv, getGooglePrivateKey } from "@/lib/env";
import { SHEET_HEADERS } from "@/lib/sheet-schema";
import type { SheetRow, SheetTab } from "@/types/models";

let sheetsClient: sheets_v4.Sheets | null = null;
const ensuredTabs = new Set<SheetTab>();

function getSheetsClient(): sheets_v4.Sheets {
  if (!sheetsClient) {
    const auth = new google.auth.JWT({
      email: getEnv("GOOGLE_CLIENT_EMAIL"),
      key: getGooglePrivateKey(),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
  }

  return sheetsClient;
}

function spreadsheetId(): string {
  return getEnv("GOOGLE_SHEET_ID");
}

function quoteTab(tab: SheetTab): string {
  return `'${tab.replace(/'/g, "''")}'`;
}

function columnLetter(index: number): string {
  let letter = "";
  let current = index;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    current = Math.floor((current - 1) / 26);
  }

  return letter;
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

async function getSheetIdForTab(tab: SheetTab): Promise<number | null> {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId(),
    fields: "sheets.properties(sheetId,title)",
  });

  const sheet = response.data.sheets?.find(
    (candidate) => candidate.properties?.title === tab,
  );

  return sheet?.properties?.sheetId ?? null;
}

export async function ensureSheetTab(tab: SheetTab): Promise<void> {
  if (ensuredTabs.has(tab)) {
    return;
  }

  const sheets = getSheetsClient();
  const id = spreadsheetId();
  const headers = SHEET_HEADERS[tab];
  let sheetId = await getSheetIdForTab(tab);

  if (sheetId === null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: id,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tab,
              },
            },
          },
        ],
      },
    });

    sheetId = await getSheetIdForTab(tab);
  }

  const current = await sheets.spreadsheets.values
    .get({
      spreadsheetId: id,
      range: `${quoteTab(tab)}!A1:${columnLetter(headers.length)}1`,
    })
    .then((response) => response.data.values?.[0] ?? [])
    .catch(() => []);

  const isMissingOrStale = headers.some((header, index) => current[index] !== header);

  if (isMissingOrStale) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: `${quoteTab(tab)}!A1:${columnLetter(headers.length)}1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [headers],
      },
    });
  }

  ensuredTabs.add(tab);
}

export async function ensureAllSheetTabs(tabs: SheetTab[]): Promise<void> {
  for (const tab of tabs) {
    await ensureSheetTab(tab);
  }
}

export async function readRows<T extends object>(
  tab: SheetTab,
): Promise<Array<SheetRow<T>>> {
  await ensureSheetTab(tab);

  const headers = SHEET_HEADERS[tab];
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: `${quoteTab(tab)}!A2:${columnLetter(headers.length)}`,
  });

  return (response.data.values ?? [])
    .map((values, index) => {
      const row = headers.reduce<Record<string, string>>((record, header, cellIndex) => {
        record[header] = normalizeCell(values[cellIndex]);
        return record;
      }, {});

      return {
        ...(row as T),
        __rowNumber: index + 2,
      };
    })
    .filter((row) =>
      headers.some((header) =>
        normalizeCell((row as Record<string, unknown>)[header]).trim() !== "",
      ),
    );
}

export async function appendRow<T extends object>(
  tab: SheetTab,
  data: T,
): Promise<void> {
  await ensureSheetTab(tab);

  const headers = SHEET_HEADERS[tab];
  await getSheetsClient().spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: `${quoteTab(tab)}!A:${columnLetter(headers.length)}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        headers.map((header) =>
          normalizeCell((data as Record<string, unknown>)[header]),
        ),
      ],
    },
  });
}

export async function updateRow<T extends object>(
  tab: SheetTab,
  rowNumber: number,
  data: Partial<T>,
): Promise<void> {
  await ensureSheetTab(tab);

  const headers = SHEET_HEADERS[tab];
  const existing = await getSheetsClient().spreadsheets.values
    .get({
      spreadsheetId: spreadsheetId(),
      range: `${quoteTab(tab)}!A${rowNumber}:${columnLetter(headers.length)}${rowNumber}`,
    })
    .then((response) => response.data.values?.[0] ?? []);

  const next = headers.map((header, index) => {
    if (Object.prototype.hasOwnProperty.call(data, header)) {
      return normalizeCell((data as Record<string, unknown>)[header]);
    }

    return normalizeCell(existing[index]);
  });

  await getSheetsClient().spreadsheets.values.update({
    spreadsheetId: spreadsheetId(),
    range: `${quoteTab(tab)}!A${rowNumber}:${columnLetter(headers.length)}${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [next],
    },
  });
}

export async function upsertRow<T extends object>(
  tab: SheetTab,
  keyFields: Array<keyof T & string>,
  data: T,
): Promise<void> {
  const rows = await readRows<T>(tab);
  const match = rows.find((row) =>
    keyFields.every(
      (field) =>
        normalizeCell((row as Record<string, unknown>)[field]).toLowerCase() ===
        normalizeCell((data as Record<string, unknown>)[field]).toLowerCase(),
    ),
  );

  if (match) {
    await updateRow<T>(tab, match.__rowNumber, data);
    return;
  }

  await appendRow(tab, data);
}

export async function deleteRow(tab: SheetTab, rowNumber: number): Promise<void> {
  await ensureSheetTab(tab);

  const sheetId = await getSheetIdForTab(tab);

  if (sheetId === null) {
    throw new Error(`Cannot delete row. Sheet tab ${tab} does not exist.`);
  }

  await getSheetsClient().spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId(),
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });
}

export function stripRowMetadata<T>(row: SheetRow<T>): T {
  const data = { ...row };
  delete (data as { __rowNumber?: number }).__rowNumber;

  return data as T;
}
