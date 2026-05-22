import { NextResponse } from "next/server";

import {
  errorMessage,
  jsonError,
  requireAdminApiAccess,
} from "@/lib/api-guards";
import { listUsers, updateUserAccess } from "@/lib/access-control";
import { adminUserPostSchema } from "@/lib/validation";

export async function GET() {
  try {
    const context = await requireAdminApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const data = await listUsers();
    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}

export async function POST(request: Request) {
  try {
    const context = await requireAdminApiAccess();

    if (context instanceof NextResponse) {
      return context;
    }

    const parsed = adminUserPostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid user payload.");
    }

    const data = await updateUserAccess(parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
