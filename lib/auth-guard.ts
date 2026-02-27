import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

type AuthContext =
    | { req: NextApiRequest; res: NextApiResponse }
    | GetServerSidePropsContext
    | undefined;

export async function requireAuth(context?: AuthContext) {
    const session = context
        ? await getServerSession(context.req, context.res, authOptions)
        : await getServerSession(authOptions);

    if (!session) {
        throw new Error("UNAUTHORIZED");
    }

    if (session.user.status !== "ACTIVE") {
        throw new Error("SUSPENDED");
    }

    return session;
}

export async function requireRole(roles: Role | Role[], context?: AuthContext) {
    const session = context
        ? await getServerSession(context.req, context.res, authOptions)
        : await getServerSession(authOptions);

    if (!session) {
        throw new Error("UNAUTHORIZED");
    }

    if (session.user.status !== "ACTIVE") {
        throw new Error("SUSPENDED");
    }

    const userRole = session.user.role as Role;

    if (Array.isArray(roles)) {
        if (!roles.includes(userRole)) {
            throw new Error("FORBIDDEN");
        }
    } else {
        if (userRole !== roles) {
            throw new Error("FORBIDDEN");
        }
    }

    return session;
}

export async function requireActiveUser(context?: AuthContext) {
    const session = context
        ? await getServerSession(context.req, context.res, authOptions)
        : await getServerSession(authOptions);

    if (!session) {
        throw new Error("UNAUTHORIZED");
    }

    if (session.user.status !== "ACTIVE") {
        throw new Error("SUSPENDED");
    }

    return session;
}

import { logger } from "./logger";

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

export function handleAuthError(error: unknown) {
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

