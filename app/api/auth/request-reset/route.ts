import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { logRequest, logger } from "@/lib/logger";

export const runtime = "nodejs";

const requestResetSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    logRequest(req, "API_REQUEST_RESET");
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

        // 2. Rate limit
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const { success } = await rateLimit(ip, "reset");

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // 3. Zod validation
        const validated = requestResetSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        const { email } = validated.data;

        // 4. Prisma query and logic
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const token = randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 3600000); // 1 hour

            await prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash: token,
                    expiresAt,
                },
            });

            await sendPasswordResetEmail(email, token);
        }

        // 5. Generic success regardless of account existence
        return NextResponse.json({
            message: "If an account exists, a reset link has been sent.",
        });
    } catch (error) {
        // 6. Standardized error format
        logger.error(error, "API_REQUEST_RESET_ERROR");
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
