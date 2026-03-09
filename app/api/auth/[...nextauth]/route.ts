import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIP } from "@/lib/rate-limit";

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

        const ip = getIP(req);
        const { success } = await rateLimit(ip, "login");

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }
    }

    const response = await authHandler(req, context);

    // Transform all Set-Cookie headers to be session-only (no Max-Age or Expires)
    if (response.headers.has("Set-Cookie")) {
        const setCookies = response.headers.getSetCookie();
        const newHeaders = new Headers(response.headers);
        newHeaders.delete("Set-Cookie");

        setCookies.forEach((cookie: string) => {
            // If the cookie is being deleted (Max-Age=0), let it pass through as-is
            // to ensure the browser actually removes the old cookie.
            if (cookie.includes("Max-Age=0")) {
                newHeaders.append("Set-Cookie", cookie);
                return;
            }

            const sessionOnlyCookie = cookie
                .replace(/Max-Age=[^;]+;?/i, "")
                .replace(/Expires=[^;]+;?/i, "")
                .trim()
                .replace(/;$/, ""); // Clean up trailing semicolon

            newHeaders.append("Set-Cookie", sessionOnlyCookie);
        });

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }

    return response;
}

export { handler as GET, handler as POST };
