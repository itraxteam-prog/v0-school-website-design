import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { isSessionValid } from "./verify-active-session";
import { redirect } from "next/navigation";
import { logger } from "./logger";
import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

type AuthContext =
    | { req: NextApiRequest; res: NextApiResponse }
    | GetServerSidePropsContext
    | undefined;

/**
 * Standardized portal-wide authentication guard.
 * Checks for: 
 * 1. Valid session existence
 * 2. Active account status
 * 3. Role-based permission matches
 */
export async function requirePortalAuth(allowedRoles: Role | Role[], context?: AuthContext) {
    let session;
    try {
        session = context
            ? await getServerSession(context.req, context.res, authOptions)
            : await getServerSession(authOptions);
    } catch (error) {
        if (logger) logger.error({ error }, "PORTAL_AUTH_SESSION_FETCH_ERROR");
        // If it's a connection error, it's safer to redirect than to throw 500
        if (!context) redirect("/portal/login?error=ConnectionError");
        throw new Error("UNAUTHORIZED");
    }

    if (!session || !session.user) {
        if (!context) redirect("/portal/login?error=SessionExpired");
        throw new Error("UNAUTHORIZED");
    }

    // Verify account status (isActive)
    const isValid = await isSessionValid(session.user.id);
    if (!isValid) {
        if (!context) redirect("/portal/login?error=Suspended");
        throw new Error("SUSPENDED");
    }

    const userRole = (session.user.role as string)?.toUpperCase();
    if (!userRole) throw new Error("UNAUTHORIZED");

    const roles = Array.isArray(allowedRoles) 
        ? allowedRoles.map(r => r.toUpperCase()) 
        : [allowedRoles.toUpperCase()];

    if (!roles.includes(userRole)) {
        if (!context) {
            const redirectPath = `/portal/${userRole.toLowerCase()}`;
            redirect(`${redirectPath}?error=AccessDenied`);
        }
        throw new Error("FORBIDDEN");
    }

    return session;
}

export async function requireAuth(context?: AuthContext) {
    return await requirePortalAuth(["ADMIN", "TEACHER", "STUDENT", "PARENT"], context);
}

export async function requireRole(roles: Role | Role[], context?: AuthContext) {
    return await requirePortalAuth(roles, context);
}

export async function requireActiveUser(context?: AuthContext) {
    return await requirePortalAuth(["ADMIN", "TEACHER", "STUDENT", "PARENT"], context);
}

export function handleAuthError(error: unknown) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage === "UNAUTHORIZED" || errorMessage === "Unauthorized") {
        return NextResponse.json({
            success: false,
            error: "Unauthorized",
            message: "Authentication required"
        }, { status: 401 });
    }
    
    if (errorMessage === "FORBIDDEN" || errorMessage === "Forbidden") {
        return NextResponse.json({
            success: false,
            error: "Forbidden",
            message: "You do not have permission to perform this action"
        }, { status: 403 });
    }
    
    if (errorMessage === "SUSPENDED" || errorMessage === "Suspended") {
        return NextResponse.json({
            success: false,
            error: "Suspended",
            code: "SUSPENDED",
            message: "Account suspended"
        }, { status: 403 });
    }

    if (errorMessage === "TOO_MANY_REQUESTS") {
        return NextResponse.json({
            success: false,
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please try again later."
        }, { status: 429 });
    }

    // Log the full error for internal tracking
    if (logger) logger.error({ error }, "API_ROUTE_ERROR");
    Sentry.captureException(error);

    return NextResponse.json({
        success: false,
        error: "Internal Server Error",
        message: isProd ? "An unexpected error occurred" : errorMessage
    }, { status: 500 });
}

export function handlePagesAuthError(res: NextApiResponse, error: unknown) {
    if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
            return res.status(401).json({ success: false, error: "Unauthorized access" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ success: false, error: "Forbidden access" });
        }
        if (error.message === "SUSPENDED") {
            return res.status(403).json({ success: false, error: "Account suspended", code: "SUSPENDED" });
        }
    }

    if (logger) logger.error({ error }, "Pages API Error");
    return res.status(500).json({ success: false, error: "Internal server error" });
}

