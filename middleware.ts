import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Safeguards for API, assets, and Next.js internals
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.includes(".") // matches files with extensions
    ) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    // Handle suspended users
    if (token?.status === "SUSPENDED") {
        if (pathname === "/portal/login" && req.nextUrl.searchParams.get("error") === "suspended") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/portal/login?error=suspended", req.url));
    }

    // 2. Prevent redirect loop scenario
    if (!token) {
        if (pathname === "/portal/login") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/portal/login", req.url));
    }

    // 3. If token exists and user visits login, redirect to their specific dashboard
    if (pathname === "/portal/login") {
        const role = (token.role as string)?.toUpperCase() || "STUDENT";
        const dashboard = role.toLowerCase();
        return NextResponse.redirect(new URL(`/portal/${dashboard}`, req.url));
    }

    // 4. RBAC checks for /portal paths
    if (pathname.startsWith("/portal/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/portal/login?error=AccessDenied", req.url));
    }

    if (pathname.startsWith("/portal/teacher") && (token.role !== "TEACHER" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/portal/login?error=AccessDenied", req.url));
    }

    if (pathname.startsWith("/portal/student") && (token.role !== "STUDENT" && token.role !== "TEACHER" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/portal/login?error=AccessDenied", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/portal/:path*"]
};
