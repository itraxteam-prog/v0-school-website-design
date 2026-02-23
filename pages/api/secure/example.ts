import type { NextApiHandler } from "next";
import { requireRole, handlePagesAuthError } from "@/lib/auth-guard";
import { scopedUserQuery } from "@/lib/rbacQuery";

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await requireRole(["ADMIN", "TEACHER"], { req, res });
        const data = await scopedUserQuery(session);
        return res.status(200).json(data);
    } catch (err) {
        if (err instanceof Error && ["UNAUTHORIZED", "FORBIDDEN", "SUSPENDED"].includes(err.message)) {
            return handlePagesAuthError(res, err);
        }
        return res.status(500).json({ error: "Query failed" });
    }
};

export default handler;
