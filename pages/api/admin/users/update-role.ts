import type { NextApiHandler } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { z } from "zod";

const roleUpdateSchema = z.object({
    userId: z.string(),
    role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
});

const handler: NextApiHandler = async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const parsed = roleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error);
    }

    try {
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
        console.error("Error updating user role:", err);
        return res.status(500).json({ error: "Update failed" });
    }
};

export default handler;
