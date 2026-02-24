import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils/auth-crypto";
import { signupSchema } from "@/lib/validations/auth";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";
import { logRequest, logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    logRequest(req, "API_REGISTER");
    try {
        const rawBody = await req.text();

        // 1. Large payload check
        if (rawBody.length > 1_000_000) {
            return NextResponse.json(
                { error: "Payload too large" },
                { status: 413 }
            );
        }

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON" },
                { status: 400 }
            );
        }

        // 2. Auth check
        await requireRole("ADMIN");

        // 3. Rate limit (Admin mutation)
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const limitResult = rateLimit(ip, "admin-mutation");
        if (!limitResult.success) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }

        // 4. Zod validation
        const validated = signupSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        const { email, password, name, role } = validated.data;

        // 5. Prisma query
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                name,
                role,
                status: "ACTIVE",
            },
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error && ["UNAUTHORIZED", "FORBIDDEN", "SUSPENDED"].includes(error.message)) {
            return handleAuthError(error);
        }
        logger.error(error, "API_REGISTER_ERROR");
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
