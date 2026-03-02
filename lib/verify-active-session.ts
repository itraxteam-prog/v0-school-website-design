import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Reusable helper to verify if a user's account is valid and active in the database.
 * This checks both the account status and compares the session issuance time 
 * against the user's last update time to handle password-reset invalidation.
 */
export async function isSessionValid(userId: string, sessionIat?: number): Promise<boolean> {
    if (!userId) return false;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, updatedAt: true }
        });

        if (!user || user.status !== UserStatus.ACTIVE) return false;

        // If sessionIat is provided, check if the account was updated (e.g., password reset)
        // after the session was issued.
        if (sessionIat) {
            const updatedAtSeconds = Math.floor(user.updatedAt.getTime() / 1000);
            // We allow a small grace period for clock drift (5 seconds)
            if (updatedAtSeconds > sessionIat + 5) {
                return false;
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Helper to generate a logout response that clears authentication cookies
 * and redirects the user to the login portal.
 */
export function forceLogoutResponse(req: Request, error: string = "SessionExpired") {
    const url = new URL("/portal/login", req.url);
    url.searchParams.set("error", error);

    const response = NextResponse.redirect(url);

    // Anti-caching headers to prevent back-button reentry
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    const cookies = [
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
        "next-auth.callback-url",
        "next-auth.csrf-token"
    ];

    cookies.forEach(name => {
        response.cookies.delete(name);
        response.cookies.set(name, "", {
            maxAge: 0,
            path: "/",
            expires: new Date(0),
        });
    });

    return response;
}
