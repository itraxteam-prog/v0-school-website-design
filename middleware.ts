import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        if (process.env.NODE_ENV === "development") {
            console.log("[Middleware] Invoked for path:", req.nextUrl.pathname);
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (!token) return false;

                const path = req.nextUrl.pathname;

                if (path.startsWith("/portal/admin")) {
                    return token.role === "ADMIN";
                }

                if (path.startsWith("/portal/teacher")) {
                    return token.role === "TEACHER";
                }

                if (path.startsWith("/portal/student")) {
                    return token.role === "STUDENT";
                }

                return true;
            },
        },
        pages: {
            signIn: "/portal/login",
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: ["/portal/:path*"],
};

