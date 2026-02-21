import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Protect admin routes
    if (pathname.startsWith("/portal/admin")) {
        if (!token || token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // Protect teacher routes
    if (pathname.startsWith("/portal/teacher")) {
        if (!token || (token.role !== "TEACHER" && token.role !== "ADMIN")) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // Protect student routes
    if (pathname.startsWith("/portal/student")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/portal/:path*"],
};
