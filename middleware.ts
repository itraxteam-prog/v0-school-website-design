import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // Allow public auth pages
    if (
        pathname.startsWith("/portal/login") ||
        pathname.startsWith("/portal/forgot-password") ||
        pathname.startsWith("/portal/reset-password") ||
        pathname.startsWith("/portal/403")
    ) {
        return NextResponse.next();
    }

    // Protect all /portal routes
    if (pathname.startsWith("/portal")) {
        // Not logged in
        if (!token) {
            return NextResponse.redirect(new URL("/portal/login", req.url));
        }

        const role = token.role as string;

        // Admin routes
        if (pathname.startsWith("/portal/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/portal/403", req.url));
        }

        // Teacher routes
        if (pathname.startsWith("/portal/teacher") && role !== "TEACHER") {
            return NextResponse.redirect(new URL("/portal/403", req.url));
        }

        // Student routes
        if (pathname.startsWith("/portal/student") && role !== "STUDENT") {
            return NextResponse.redirect(new URL("/portal/403", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/portal/:path*"],
};
