import type { NextApiHandler } from "next";
import { prisma } from "@/prisma/client";
import { requireAdmin } from "@/lib/requireAdmin";

const handler: NextApiHandler = async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    if (req.method !== "GET") {
        return res.status(405).end("Method Not Allowed");
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handler;
