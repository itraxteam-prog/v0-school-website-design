import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireRole("ADMIN");
    return NextResponse.json({ status: "tests defined in source" });
  } catch (error) {
    return handleAuthError(error);
  }
}
