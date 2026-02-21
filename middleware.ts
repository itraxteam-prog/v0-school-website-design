import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
    callbacks: {
        authorized({ token }) {
            // Allow only authenticated users
            return !!token;
        },
    },
});

export const config = {
    matcher: [
        "/portal/:path*",   // Protect all portal routes
        "/admin/:path*",    // Protect admin routes
    ],
};
