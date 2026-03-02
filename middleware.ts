import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Add public route bypass
  const PUBLIC_PATHS = [
    "/",
    "/portal/login",
    "/portal/register",
    "/portal/forgot-password",
    "/portal/reset-password",
    "/api/auth",
    "/_next",
    "/favicon.ico"
  ];

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2️⃣ Ensure middleware imports only JWT logic from NextAuth, no Prisma or DB code.
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // 3️⃣ Before redirecting unauthenticated users, ensure login is excluded
  if (!token && pathname !== "/portal/login") {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  // RBAC checks for API routes
  if (pathname.startsWith("/api")) {
    if (
      (pathname.startsWith("/api/register") ||
        pathname.startsWith("/api/admin") ||
        pathname.startsWith("/api/users")) &&
      token?.role !== "ADMIN"
    ) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (pathname.startsWith("/api/secure") && !["ADMIN", "TEACHER"].includes(token?.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  // RBAC checks for Portal routes
  const userRole = (token?.role as string)?.toUpperCase();
  let response = NextResponse.next();

  if (pathname.startsWith("/portal/admin") && userRole !== "ADMIN") {
    const role = userRole?.toLowerCase() || "student";
    response = NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, request.url), 307);
  } else if (pathname.startsWith("/portal/teacher") && userRole !== "TEACHER") {
    const role = userRole?.toLowerCase() || "student";
    response = NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, request.url), 307);
  } else if (pathname.startsWith("/portal/student") && userRole !== "STUDENT") {
    const role = userRole?.toLowerCase() || "admin";
    response = NextResponse.redirect(new URL(`/portal/${role}?error=AccessDenied`, request.url), 307);
  }

  // Anti-caching for portal pages
  if (pathname.startsWith("/portal")) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

// 4️⃣ Update matcher to protect only protected zones
export const config = {
  matcher: [
    "/portal/:path*",
    "/api/:path*",
  ],
};
