import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function requireAdmin(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        res.status(403).json({ error: "Forbidden: Admin access required" });
        return null;
    }

    return session;
}
