import type { NextApiHandler } from "next";
import { prisma } from "@/prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        // Return success even if user not found for security reasons
        return res.status(200).json({ message: "If account exists, email sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    await prisma.passwordResetToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
    });

    try {
        await sendPasswordResetEmail(user.email, rawToken);
    } catch (error) {
        console.error("Failed to send reset email:", error);
        // Still return success to prevent email enumeration
    }

    return res.status(200).json({ message: "If account exists, email sent." });
};

export default handler;
