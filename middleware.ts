import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Debug logging for middleware path
        if (process.env.NODE_ENV === "development") {
            console.log("[Middleware] Invoked for path:", req.nextUrl.pathname);
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                try {
                    // Safe handling of null/undefined tokens
                    const isAuthorized = !!token;
                    if (process.env.NODE_ENV === "development") {
                        console.log("[Middleware] Authorized:", isAuthorized);
                    }
                    return isAuthorized;
                } catch (error) {
                    console.error("[Middleware] Authorization Callback Error:", error);
                    return false;
                }
            },
        },
        pages: {
            signIn: "/auth/login",
        },
        // Explicitly passing secret to fix common MIDDLEWARE_INVOCATION_FAILED issues in Vercel
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: ["/portal/:path*"],
};

