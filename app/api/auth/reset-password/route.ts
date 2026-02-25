import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils/auth-crypto";
import { z } from "zod";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { logRequest, logger } from "@/lib/logger";

export const runtime = "nodejs";

const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8),
});

export async function POST(req: NextRequest) {
    logRequest(req, "API_RESET_PASSWORD");
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

        // 2. Rate limit (use "reset" bucket)
        const ip = getIP(req);
        const { success } = await rateLimit(ip, "reset");

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // 3. Zod validation
        const validated = resetPasswordSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { error: "Invalid input format" },
                { status: 400 }
            );
        }

        const { token, password } = validated.data;

        // 4. Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash: token },
            include: { user: true },
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // 5. Update password
        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });

        // 6. Delete token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id },
        });

        logger.info({ userId: resetToken.userId }, "PASSWORD_RESET_SUCCESS");

        return NextResponse.json({
            message: "Password has been reset successfully.",
        });
    } catch (error) {
        logger.error(error, "API_RESET_PASSWORD_ERROR");
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
