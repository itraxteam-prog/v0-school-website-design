import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const authHandler = NextAuth(authOptions);

async function handler(req: NextRequest, context: any) {
    if (req.method === "POST" && req.nextUrl.pathname.endsWith("/signin/credentials")) {
        // Check payload size
        const clonedReq = req.clone();
        const rawBody = await clonedReq.text();

        if (rawBody.length > 1_000_000) {
            return NextResponse.json(
                { error: "Payload too large" },
                { status: 413 }
            );
        }

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const limitResult = rateLimit(ip, "login");

        if (!limitResult.success) {
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                { status: 429 }
            );
        }
    }
    return authHandler(req, context);
}

export { handler as GET, handler as POST };
