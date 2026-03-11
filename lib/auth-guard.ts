import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { isSessionValid } from "./verify-active-session";
import { redirect } from "next/navigation";

type AuthContext =
    | { req: NextApiRequest; res: NextApiResponse }
    | GetServerSidePropsContext
    | undefined;

export async function requireAuth(context?: AuthContext) {
    let session;
    try {
        session = context
            ? await getServerSession(context.req, context.res, authOptions)
            : await getServerSession(authOptions);
    } catch (error) {
        logger.error({ error }, "AUTH_SESSION_FETCH_ERROR");
        if (!context) redirect("/portal/login?error=ConnectionError");
        throw new Error("UNAUTHORIZED");
    }

    if (!session) {
        if (!context) redirect("/portal/login?error=SessionExpired");
        throw new Error("UNAUTHORIZED");
    }

    if (!(await isSessionValid(session.user.id))) {
        if (!context) redirect("/portal/login?error=Suspended");
        throw new Error("SUSPENDED");
    }

    return session;
}

export async function requireRole(roles: Role | Role[], context?: AuthContext) {
    let session;
    try {
        session = context
            ? await getServerSession(context.req, context.res, authOptions)
            : await getServerSession(authOptions);
    } catch (error) {
        logger.error({ error }, "ROLE_SESSION_FETCH_ERROR");
        if (!context) redirect("/portal/login?error=ConnectionError");
        throw new Error("UNAUTHORIZED");
    }

    if (!session) {
        if (!context) redirect("/portal/login?error=SessionExpired");
        throw new Error("UNAUTHORIZED");
    }

    if (!(await isSessionValid(session.user.id))) {
        if (!context) redirect("/portal/login?error=Suspended");
        throw new Error("SUSPENDED");
    }

    const userRole = (session.user.role as string)?.toUpperCase();

    const checkRoleMismatch = (requiredRole: string) => {
        if (userRole !== requiredRole.toUpperCase()) {
            if (!context) {
                const targetPortal = userRole ? `/portal/${userRole.toLowerCase()}` : "/portal/login";
                redirect(`${targetPortal}?error=AccessDenied`);
            }
            throw new Error("FORBIDDEN");
        }
    }

    if (Array.isArray(roles)) {
        const upperRoles = roles.map(r => r.toUpperCase());
        if (!upperRoles.includes(userRole)) {
            if (!context) {
                const targetPortal = userRole ? `/portal/${userRole.toLowerCase()}` : "/portal/login";
                redirect(`${targetPortal}?error=AccessDenied`);
            }
            throw new Error("FORBIDDEN");
        }
    } else {
        checkRoleMismatch(roles);
    }

    return session;
}

export async function requireActiveUser(context?: AuthContext) {
    let session;
    try {
        session = context
            ? await getServerSession(context.req, context.res, authOptions)
            : await getServerSession(authOptions);
    } catch (error) {
        logger.error({ error }, "ACTIVE_USER_SESSION_FETCH_ERROR");
        if (!context) redirect("/portal/login?error=ConnectionError");
        throw new Error("UNAUTHORIZED");
    }

    if (!session) {
        if (!context) redirect("/portal/login?error=SessionExpired");
        throw new Error("UNAUTHORIZED");
    }

    if (!(await isSessionValid(session.user.id))) {
        if (!context) redirect("/portal/login?error=Suspended");
        throw new Error("SUSPENDED");
    }

    return session;
}

import { logger } from "./logger";

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

export function handleAuthError(error: unknown) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
    }

    if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
            return NextResponse.json({
                success: false,
                error: "Unauthorized",
                message: "Authentication required"
            }, { status: 401 });
        }
        if (error.message === "FORBIDDEN") {
            return NextResponse.json({
                success: false,
                error: "Forbidden",
                message: "You do not have permission to perform this action"
            }, { status: 403 });
        }
        if (error.message === "SUSPENDED") {
            return NextResponse.json({
                success: false,
                error: "Suspended",
                code: "SUSPENDED",
                message: "Account suspended"
            }, { status: 403 });
        }
        if (error.message === "TOO_MANY_REQUESTS") {
            return NextResponse.json({
                success: false,
                error: "Too Many Requests",
                message: "Rate limit exceeded. Please try again later."
            }, { status: 429 });
        }
    }

    // Log the full error for internal tracking
    logger.error({ error }, "API_ROUTE_ERROR");
    Sentry.captureException(error);

    return NextResponse.json({
        success: false,
        error: "Internal Server Error",
        message: isProd ? "An unexpected error occurred" : (error instanceof Error ? error.message : "Internal Server Error")
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

    logger.error({ error }, "Pages API Error");
    return res.status(500).json({ success: false, error: "Internal server error" });
}

