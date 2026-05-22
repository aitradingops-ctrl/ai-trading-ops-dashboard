import { NextResponse } from "next/server";

import { ensureUserProfile } from "@/lib/access-control";
import { errorMessage, jsonError, requireApiSession } from "@/lib/api-guards";
import { createPayPalSubscription } from "@/lib/paypal-service";

export async function POST() {
  try {
    const sessionUser = await requireApiSession();

    if (sessionUser instanceof NextResponse) {
      return sessionUser;
    }

    await ensureUserProfile(sessionUser.email, sessionUser.name);
    const data = await createPayPalSubscription(sessionUser.email);

    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
