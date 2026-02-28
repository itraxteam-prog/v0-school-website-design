import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Middleware is now JWT-only to support Edge runtime.
  // Account status (SUSPENDED) and session invalidation checks
  // are moved to server components and API routes.

  // Root URL
  if (pathname === "/") {
    if (!token) return NextResponse.redirect(new URL("/portal/login", req.url), 307);
    const role = (token.role as string)?.toLowerCase() || "student";
    const targetUrl = role === "admin" || role === "teacher" || role === "student" ? `/portal/${role}` : "/portal/login";
    return NextResponse.redirect(new URL(targetUrl, req.url), 307);
  }

  // API routes
  if (pathname.startsWith("/api")) {
    if (
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/health") ||
      pathname.startsWith("/api/test-error")
    ) return NextResponse.next();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check role-based access
    if (
      (pathname.startsWith("/api/register") ||
        pathname.startsWith("/api/admin") ||
        pathname.startsWith("/api/users")) &&
      token.role !== "ADMIN"
    ) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (pathname.startsWith("/api/secure") && !["ADMIN", "TEACHER"].includes(token.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  // Prevent redirect loop
  if (!token) {
    if (pathname === "/portal/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/portal/login", req.url), 307);
  }

  // Redirect logged-in users from login
  if (pathname === "/portal/login") {
    const role = (token.role as string)?.toUpperCase();
    if (role === "ADMIN" || role === "TEACHER" || role === "STUDENT") {
      return NextResponse.redirect(new URL(`/portal/${role.toLowerCase()}`, req.url), 307);
    }
    return NextResponse.next();
  }

  // RBAC portal checks 
  const userRole = (token.role as string)?.toUpperCase();

  let response = NextResponse.next();

  if (pathname.startsWith("/portal/admin") && userRole !== "ADMIN") {
    const role = userRole?.toLowerCase() || "student";
    response = NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, req.url), 307);
  } else if (pathname.startsWith("/portal/teacher") && userRole !== "TEACHER") {
    const role = userRole?.toLowerCase() || "student";
    response = NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, req.url), 307);
  } else if (pathname.startsWith("/portal/student") && userRole !== "STUDENT") {
    const role = userRole?.toLowerCase() || "admin";
    response = NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, req.url), 307);
  }

  // Task 6: Prevent back-button reentry by adding anti-caching headers for portal pages
  if (pathname.startsWith("/portal")) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/api/:path*", "/"]
};
