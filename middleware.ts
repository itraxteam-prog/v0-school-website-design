import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;




  // 1️⃣ Public route bypass
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

  // 2️⃣ Get Token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // 3️⃣ Basic Authentication Check
  if (!token || !token.id) {
    const url = new URL("/portal/login", request.url);
    url.searchParams.set("error", "SessionExpired");
    return NextResponse.redirect(url);
  }

  // Session-only middleware. 
  // Detailed RBAC is handled at the Page/API level for maximum reliability.
  const response = NextResponse.next();

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
