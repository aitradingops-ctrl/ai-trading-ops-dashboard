import "server-only";

type EnvKey =
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "NEXTAUTH_SECRET"
  | "NEXTAUTH_URL"
  | "GOOGLE_CLIENT_EMAIL"
  | "GOOGLE_PRIVATE_KEY"
  | "GOOGLE_SHEET_ID"
  | "APP_ADMIN_EMAIL"
  | "PAYPAL_CLIENT_ID"
  | "PAYPAL_CLIENT_SECRET"
  | "PAYPAL_WEBHOOK_ID"
  | "PAYPAL_PLAN_ID";

export function getEnv(key: EnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getOptionalEnv(key: EnvKey): string {
  return process.env[key] ?? "";
}

export function getGooglePrivateKey(): string {
  return getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
}

export function getAppBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}
