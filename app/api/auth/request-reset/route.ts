import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

export const runtime = "nodejs";

const requestResetSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = requestResetSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        const { email } = validated.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Return 200 even if user doesn't exist for security
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

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

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error("Request reset error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
