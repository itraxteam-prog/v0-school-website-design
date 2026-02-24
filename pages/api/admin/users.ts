import type { NextApiHandler } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole, handlePagesAuthError } from "@/lib/auth-guard";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await requireRole("ADMIN", { req, res });

        if (req.method === "GET") {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    status: true,
                    createdAt: true
                },
                orderBy: { createdAt: "desc" },
            });
            return res.status(200).json(users);
        }

        if (req.method === "DELETE") {
            const schema = z.object({
                id: z.string().uuid()
            });

            const parsed = schema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({ error: "Invalid ID format" });
            }

            const { id } = parsed.data;

            await prisma.user.delete({
                where: { id },
            });

            await logAudit({
                userId: session.user.id,
                action: "DELETE_USER",
                entity: "User",
                entityId: String(id),
                metadata: { deletedBy: session.user.email },
            });

            return res.status(200).json({ success: true });
        }

        return res.status(405).end("Method Not Allowed");
    } catch (err) {
        if (err instanceof Error && ["UNAUTHORIZED", "FORBIDDEN", "SUSPENDED"].includes(err.message)) {
            return handlePagesAuthError(res, err);
        }
        console.error("[API Error]", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handler;
