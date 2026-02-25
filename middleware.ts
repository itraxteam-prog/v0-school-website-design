import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Assets and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    // 2. Handle API routes
    if (pathname.startsWith("/api")) {
        // Public API routes
        if (
            pathname.startsWith("/api/auth") ||
            pathname.startsWith("/api/health") ||
            pathname.startsWith("/api/test-error")
        ) {
            return NextResponse.next();
        }

        // Authenticated API routes
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (token.status === "SUSPENDED") {
            return NextResponse.json({ error: "Account suspended" }, { status: 403 });
        }

        // Admin-only API routes
        if (
            (pathname.startsWith("/api/register") ||
                pathname.startsWith("/api/admin") ||
                pathname.startsWith("/api/users")) &&
            token.role !== "ADMIN"
        ) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Staff-only API routes (Admin or Teacher)
        if (
            pathname.startsWith("/api/secure") &&
            token.role !== "ADMIN" &&
            token.role !== "TEACHER"
        ) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.next();
    }

    // 3. Handle suspended users for UI
    if (token?.status === "SUSPENDED") {
        if (pathname === "/portal/login" && req.nextUrl.searchParams.get("error") === "suspended") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/portal/login?error=suspended", req.url));
    }

    // 4. Prevent redirect loop scenario for UI
    if (!token) {
        if (pathname === "/portal/login") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/portal/login", req.url));
    }

    // 5. Redirect logged-in users from login page
    if (pathname === "/portal/login") {
        const role = (token.role as string)?.toUpperCase() || "STUDENT";
        const dashboard = role.toLowerCase();
        return NextResponse.redirect(new URL(`/portal/${dashboard}`, req.url));
    }

    // 6. RBAC checks for /portal paths
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
    matcher: ["/portal/:path*", "/api/:path*"]
};
