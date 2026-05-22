import { NextResponse } from "next/server";

import { errorMessage, jsonError, requireApiAccess } from "@/lib/api-guards";
import { listTrades, upsertTrade } from "@/lib/trading-data-service";
import { tradePostSchema } from "@/lib/validation";

export async function GET() {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await listTrades(context.sessionUser.email);
    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}

export async function POST(request: Request) {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const parsed = tradePostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid trade payload.");
    }

    const trade = await upsertTrade(context.sessionUser.email, parsed.data);
    return NextResponse.json({ data: trade });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
