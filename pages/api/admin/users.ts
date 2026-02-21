import type { NextApiHandler } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/requireRole";
import { logAudit } from "@/lib/audit";

const handler: NextApiHandler = async (req, res) => {
    const session = await requireRole(req, res, ["ADMIN"]);
    if (!session) return;

    if (req.method === "GET") {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true },
        });
        res.status(200).json(users);
        return;
    }

    if (req.method === "DELETE") {
        const { id } = req.query;

        await prisma.user.delete({
            where: { id: String(id) },
        });

        await logAudit({
            userId: session.user.id,
            action: "DELETE_USER",
            entity: "User",
            entityId: String(id),
            metadata: { deletedBy: session.user.email },
        });

        res.status(200).json({ success: true });
        return;
    }

    res.status(405).end("Method Not Allowed");
};

export default handler;
