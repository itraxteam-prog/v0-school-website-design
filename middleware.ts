import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = req.nextUrl;

    // 1. If no token and not on login page, redirect to login
    if (!token && pathname !== "/portal/login") {
        return NextResponse.redirect(new URL("/portal/login", req.url));
    }

    // 2. If token exists and on login page, redirect to their dashboard
    if (token && pathname === "/portal/login") {
        const role = (token.role as string)?.toLowerCase() || "student";
        return NextResponse.redirect(new URL(`/portal/${role}`, req.url));
    }

    // 3. RBAC checks
    if (token) {
        if (pathname.startsWith("/portal/admin") && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/portal/login?error=AccessDenied", req.url));
        }

        if (pathname.startsWith("/portal/teacher") && token.role !== "TEACHER" && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/portal/login?error=AccessDenied", req.url));
        }

        if (pathname.startsWith("/portal/student") && token.role !== "STUDENT" && token.role !== "TEACHER" && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/portal/login?error=AccessDenied", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/portal/:path*"]
};
