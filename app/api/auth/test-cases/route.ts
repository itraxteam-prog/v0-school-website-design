import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse, NextRequest } from "next/server";
import { logRequest } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  logRequest(req, "API_TEST_CASES");
  try {
    await requireRole("ADMIN");
    return NextResponse.json({ status: "tests defined in source" });
  } catch (error) {
    return handleAuthError(error);
  }
}
