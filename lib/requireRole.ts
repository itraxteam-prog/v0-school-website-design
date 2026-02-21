import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

// Define role union once
export type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

export async function requireRole(
    req: NextApiRequest,
    res: NextApiResponse,
    roles: AppRole[]
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return null;
    }

    // Cast safely to union
    const userRole = session.user.role as AppRole;

    if (!roles.includes(userRole)) {
        res.status(403).json({ error: "Forbidden" });
        return null;
    }

    return session;
}
