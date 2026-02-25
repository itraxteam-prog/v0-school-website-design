import { NextResponse } from "next/server";

/**
 * Temporary test route to verify Sentry integration.
 * This route is safe for production as Next.js 14 App Router
 * automatically masks stack traces in production responses.
 */
export const dynamic = "force-dynamic";

export async function GET() {
    console.log("Triggering Sentry test error...");

    // This error will be captured by Sentry via instrumentation.ts
    throw new Error("Sentry test error");
}
