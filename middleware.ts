import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Root URL
  if (pathname === "/") {
    if (!token) return NextResponse.redirect(new URL("/portal/login", req.url), 307);
    const role = (token.role as string)?.toLowerCase() || "student";
    // Ensure we don't redirect to /portal/ directly if there's no role
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
    if (token.status === "SUSPENDED") return NextResponse.json({ error: "Account suspended" }, { status: 403 });

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

  // Suspended users
  if (token?.status === "SUSPENDED") {
    if (pathname === "/portal/login" && req.nextUrl.searchParams.get("error") === "suspended") return NextResponse.next();
    return NextResponse.redirect(new URL("/portal/login?error=suspended", req.url), 307);
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

  // RBAC portal checks with case-insensitivity and existence check
  const userRole = (token.role as string)?.toUpperCase();

  if (pathname.startsWith("/portal/admin") && userRole !== "ADMIN") {
    const role = userRole?.toLowerCase() || "student";
    if (role === "admin") return NextResponse.redirect(new URL("/portal/login", req.url), 307); // Should not happen but safety
    return NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, req.url), 307);
  }
  if (pathname.startsWith("/portal/teacher") && userRole !== "TEACHER") {
    const role = userRole?.toLowerCase() || "student";
    if (role === "teacher") return NextResponse.redirect(new URL("/portal/login", req.url), 307);
    return NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, req.url), 307);
  }
  if (pathname.startsWith("/portal/student") && userRole !== "STUDENT") {
    const role = userRole?.toLowerCase() || "admin";
    if (role === "student") return NextResponse.redirect(new URL("/portal/login", req.url), 307);
    return NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, req.url), 307);
  }

  // Legacy security route
  if (pathname === "/portal/security") {
    const role = (token.role as string)?.toLowerCase() || "student";
    return NextResponse.redirect(new URL(`/portal/${role}/security`, req.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/api/:path*", "/"]
};
