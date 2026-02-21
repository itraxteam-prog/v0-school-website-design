import type { NextApiHandler } from "next";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const record = await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
    });

    if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ error: "Token invalid or expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
        where: { tokenHash },
    });

    return res.status(200).json({ message: "Password reset successful" });
};

export default handler;
