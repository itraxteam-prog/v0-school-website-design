import { NextResponse } from "next/server";
import { logRequest } from "@/lib/logger";

export async function GET(req: Request) {
    logRequest(req, "Health Check");
    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
}
