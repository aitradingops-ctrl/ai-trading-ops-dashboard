import { NextResponse } from "next/server";

import { applyPaypalSubscriptionUpdate } from "@/lib/access-control";
import { errorMessage, jsonError } from "@/lib/api-guards";
import {
  summarizePayPalWebhook,
  verifyPayPalWebhook,
} from "@/lib/paypal-service";
import { logAlert } from "@/lib/trading-data-service";

export async function POST(request: Request) {
  try {
    const event = await request.json();
    const isVerified = await verifyPayPalWebhook(event, request.headers);

    if (!isVerified) {
      return jsonError("Invalid PayPal webhook signature.", 401);
    }

    const summary = summarizePayPalWebhook(event);

    if (!summary.subscriptionStatus) {
      return NextResponse.json({
        ok: true,
        ignored: true,
        eventType: summary.eventType,
      });
    }

    const user = await applyPaypalSubscriptionUpdate({
      subscriptionId: summary.subscriptionId,
      paypalCustomerEmail: summary.payerEmail,
      userEmail: summary.userEmail,
      subscriptionStatus: summary.subscriptionStatus,
    });

    if (user) {
      await logAlert(user.userEmail, {
        ticker: "N/A",
        eventType: summary.eventType,
        message: `PayPal subscription status updated to ${summary.subscriptionStatus}.`,
        source: "paypal",
        payload: JSON.stringify(event),
      });
    }

    return NextResponse.json({ ok: true, userEmail: user?.userEmail ?? null });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
