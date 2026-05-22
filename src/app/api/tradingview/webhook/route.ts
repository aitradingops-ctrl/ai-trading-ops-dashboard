import { NextResponse } from "next/server";

import { evaluateUserAccess, getUserByEmail } from "@/lib/access-control";
import { errorMessage, jsonError } from "@/lib/api-guards";
import { findUserEmailByWebhookToken } from "@/lib/settings-service";
import { createSignal, logAlert } from "@/lib/trading-data-service";
import { tradingViewWebhookSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = tradingViewWebhookSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message ?? "Invalid TradingView webhook payload.",
      );
    }

    const userEmail = await findUserEmailByWebhookToken(parsed.data.webhookToken);

    if (!userEmail) {
      return jsonError("Missing or invalid TradingView webhook token.", 401);
    }

    const user = await getUserByEmail(userEmail);
    const access = evaluateUserAccess(user);

    if (!access.hasAccess) {
      return jsonError(`Webhook user is not allowed: ${access.reason}`, 403);
    }

    const signal = await createSignal(userEmail, {
      timestamp: parsed.data.time,
      ticker: parsed.data.ticker,
      exchange: parsed.data.exchange,
      price: String(parsed.data.price ?? ""),
      direction: parsed.data.direction,
      setupType: parsed.data.strategy,
      confidenceScore: String(parsed.data.confidenceScore ?? "0"),
      riskRating: "Medium",
      notes: parsed.data.notes,
      status: "new",
      source: "tradingview",
    });

    await logAlert(userEmail, {
      ticker: parsed.data.ticker,
      eventType: "TRADINGVIEW_ALERT",
      message: parsed.data.notes,
      source: "tradingview",
      payload: JSON.stringify({
        ...parsed.data,
        webhookToken: "[redacted]",
      }),
    });

    return NextResponse.json({ ok: true, data: signal });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
