import "server-only";

import { getAppBaseUrl, getEnv } from "@/lib/env";
import { publicConfig } from "@/lib/public-config";
import type { SubscriptionStatus } from "@/types/models";

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PayPalSubscriptionResult {
  subscriptionId: string;
  approveUrl: string;
}

export interface PayPalWebhookSummary {
  eventType: string;
  subscriptionId: string;
  payerEmail: string;
  userEmail: string;
  subscriptionStatus: SubscriptionStatus;
}

function paypalBaseUrl(): string {
  return process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
}

async function getPayPalAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${getEnv("PAYPAL_CLIENT_ID")}:${getEnv("PAYPAL_CLIENT_SECRET")}`,
  ).toString("base64");

  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal OAuth failed: ${response.status} ${await response.text()}`);
  }

  const payload = (await response.json()) as PayPalTokenResponse;
  return payload.access_token;
}

export async function createPayPalSubscription(
  userEmail: string,
): Promise<PayPalSubscriptionResult> {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: getEnv("PAYPAL_PLAN_ID"),
      custom_id: userEmail,
      application_context: {
        brand_name: publicConfig.appName,
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${getAppBaseUrl()}/dashboard`,
        cancel_url: `${getAppBaseUrl()}/pricing?cancelled=1`,
      },
      subscriber: {
        email_address: userEmail,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `PayPal subscription creation failed: ${response.status} ${await response.text()}`,
    );
  }

  const payload = await response.json();
  const approveUrl =
    payload.links?.find((link: { rel: string; href: string }) => link.rel === "approve")
      ?.href ?? "";

  return {
    subscriptionId: payload.id,
    approveUrl,
  };
}

export async function verifyPayPalWebhook(
  event: unknown,
  headers: Headers,
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${paypalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: getEnv("PAYPAL_WEBHOOK_ID"),
        webhook_event: event,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `PayPal webhook verification failed: ${response.status} ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as { verification_status?: string };
  return payload.verification_status === "SUCCESS";
}

function mapPayPalStatus(eventType: string): SubscriptionStatus {
  switch (eventType) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      return "active";
    case "BILLING.SUBSCRIPTION.CANCELLED":
      return "cancelled";
    case "BILLING.SUBSCRIPTION.SUSPENDED":
      return "suspended";
    case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
      return "payment_failed";
    case "PAYMENT.SALE.COMPLETED":
    case "PAYMENT.CAPTURE.COMPLETED":
    case "BILLING.SUBSCRIPTION.PAYMENT.COMPLETED":
      return "payment_completed";
    default:
      return "";
  }
}

export function summarizePayPalWebhook(event: unknown): PayPalWebhookSummary {
  const payload = event as {
    event_type?: string;
    resource?: {
      id?: string;
      billing_agreement_id?: string;
      custom_id?: string;
      subscriber?: { email_address?: string };
      payer?: { email_address?: string };
      supplementary_data?: {
        related_ids?: {
          subscription_id?: string;
        };
      };
    };
  };
  const resource = payload.resource ?? {};
  const eventType = payload.event_type ?? "";
  const subscriptionStatus = mapPayPalStatus(eventType);
  const subscriptionId =
    resource.supplementary_data?.related_ids?.subscription_id ||
    resource.billing_agreement_id ||
    resource.id ||
    "";
  const payerEmail =
    resource.subscriber?.email_address || resource.payer?.email_address || "";
  const userEmail = resource.custom_id || payerEmail;

  return {
    eventType,
    subscriptionId,
    payerEmail,
    userEmail,
    subscriptionStatus,
  };
}
