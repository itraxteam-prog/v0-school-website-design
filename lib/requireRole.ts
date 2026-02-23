import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import type { Role } from "@prisma/client";

export async function requireRole(
    req: NextApiRequest,
    res: NextApiResponse,
    roles: Role[]
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !roles.includes(session.user.role)) {
        res.status(403).json({ error: "Forbidden" });
        return null;
    }

    return session;
}
