import type { NextApiHandler } from "next";
import { requireRole } from "@/lib/requireRole";
import { scopedUserQuery } from "@/lib/rbacQuery";

const handler: NextApiHandler = async (req, res) => {
    const session = await requireRole(req, res, ["ADMIN", "TEACHER"]);
    if (!session) return;

    try {
        const data = await scopedUserQuery(session);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Query failed" });
    }
};

export default handler;
