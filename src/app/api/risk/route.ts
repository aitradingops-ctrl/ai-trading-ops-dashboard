import { NextResponse } from "next/server";

import { errorMessage, jsonError, requireApiAccess } from "@/lib/api-guards";
import { createRiskLog, listRiskLogs } from "@/lib/trading-data-service";
import { riskPostSchema } from "@/lib/validation";

export async function GET() {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await listRiskLogs(context.sessionUser.email);
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

    const parsed = riskPostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid risk payload.");
    }

    const risk = await createRiskLog(context.sessionUser.email, parsed.data);
    return NextResponse.json({ data: risk });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
