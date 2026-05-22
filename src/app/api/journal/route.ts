import { NextResponse } from "next/server";

import { errorMessage, jsonError, requireApiAccess } from "@/lib/api-guards";
import {
  createJournalEntry,
  listJournalEntries,
} from "@/lib/trading-data-service";
import { journalPostSchema } from "@/lib/validation";

export async function GET() {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await listJournalEntries(context.sessionUser.email);
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

    const parsed = journalPostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid journal payload.");
    }

    const entry = await createJournalEntry(context.sessionUser.email, parsed.data);
    return NextResponse.json({ data: entry });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
