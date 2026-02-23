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

export function handleAuthError(error: unknown) {
    if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }
        if (error.message === "FORBIDDEN") {
            return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
        }
        if (error.message === "SUSPENDED") {
            return NextResponse.json({ error: "Account suspended", code: "SUSPENDED" }, { status: 403 });
        }
    }

    console.error("Auth Guard Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function handlePagesAuthError(res: NextApiResponse, error: unknown) {
    if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ error: "Forbidden access" });
        }
        if (error.message === "SUSPENDED") {
            return res.status(403).json({ error: "Account suspended", code: "SUSPENDED" });
        }
    }

    console.error("Auth Guard Error:", error);
    return res.status(500).json({ error: "Internal server error" });
}
