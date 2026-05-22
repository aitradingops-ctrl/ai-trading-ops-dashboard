import { NextResponse } from "next/server";

import { errorMessage, jsonError, requireApiAccess } from "@/lib/api-guards";
import { createSignal, listSignals } from "@/lib/trading-data-service";
import { signalPostSchema } from "@/lib/validation";

export async function GET() {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await listSignals(context.sessionUser.email);
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

    const parsed = signalPostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid signal payload.");
    }

    const signal = await createSignal(context.sessionUser.email, parsed.data);
    return NextResponse.json({ data: signal });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
