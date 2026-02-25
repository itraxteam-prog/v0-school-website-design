import type { NextApiHandler } from "next";
import { prisma } from "@/lib/prisma";
import { rateLimit, getPagesIP } from "@/lib/rate-limit";
import { requireRole, handlePagesAuthError } from "@/lib/auth-guard";
import { z } from "zod";

const roleUpdateSchema = z.object({
    userId: z.string(),
    role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
});

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await requireRole("ADMIN", { req, res });

        if (req.method !== "POST") {
            return res.status(405).end("Method Not Allowed");
        }

        const ip = getPagesIP(req);
        const { success } = await rateLimit(ip, "mutation");
        if (!success) {
            return res.status(429).json({ error: "Too many requests" });
        }

        const parsed = roleUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }

        const updated = await prisma.user.update({
            where: { id: parsed.data.userId },
            data: { role: parsed.data.role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return res.status(200).json(updated);
    } catch (err) {
        if (err instanceof Error && ["UNAUTHORIZED", "FORBIDDEN", "SUSPENDED"].includes(err.message)) {
            return handlePagesAuthError(res, err);
        }
        console.error("Error updating user role:", err);
        return res.status(500).json({ error: "Update failed" });
    }
};

export default handler;
