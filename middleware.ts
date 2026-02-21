import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // This function is only called if authorized callback returns true
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: ["/portal/:path*"],
};

