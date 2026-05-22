import { NextResponse } from "next/server";

import { errorMessage, jsonError, requireApiAccess } from "@/lib/api-guards";
import {
  listWatchlist,
  removeWatchlistItem,
  upsertWatchlistItem,
} from "@/lib/trading-data-service";
import { watchlistPostSchema } from "@/lib/validation";

export async function GET() {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await listWatchlist(context.sessionUser.email);
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

    const parsed = watchlistPostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid watchlist payload.");
    }

    if (parsed.data.action === "delete") {
      await removeWatchlistItem(context.sessionUser.email, parsed.data.ticker);
      return NextResponse.json({ ok: true });
    }

    const item = await upsertWatchlistItem(context.sessionUser.email, parsed.data);
    return NextResponse.json({ data: item });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
