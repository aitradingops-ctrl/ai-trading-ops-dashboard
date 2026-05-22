import { NextResponse } from "next/server";

import { errorMessage, jsonError, requireApiAccess } from "@/lib/api-guards";
import { getUserSettings, saveUserSettings } from "@/lib/settings-service";
import { settingsPostSchema } from "@/lib/validation";
import type { UserSettings } from "@/types/models";

export async function GET() {
  try {
    const context = await requireApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await getUserSettings(context.sessionUser.email);
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

    const parsed = settingsPostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid settings payload.");
    }

    const data = await saveUserSettings(
      context.sessionUser.email,
      parsed.data.settings as Partial<UserSettings>,
      {
        regenerateTradingViewWebhookToken:
          parsed.data.regenerateTradingViewWebhookToken,
      },
    );

    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
