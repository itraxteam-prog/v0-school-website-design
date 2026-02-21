import type { NextApiHandler } from "next";
import { prisma } from "@/lib/prisma";
import { validateRequest, userSchema } from "@/lib/validation";
import bcrypt from "bcrypt";
import { rateLimit } from "@/lib/rateLimit";
import { requireRole } from "@/lib/requireRole";

const handler: NextApiHandler = async (req, res) => {
    // 1. Authentication and Authorization check (Admin only)
    const session = await requireRole(req, res, ["ADMIN"]);
    if (!session) return;

    const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        "unknown";

    // Rate limit check
    if (!rateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests" });
    }

    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    // Validate request body
    const data = validateRequest(userSchema, req, res);
    if (!data) return; // Error response handled in validateRequest

    try {
        // Destructure classId as it's not a field in the User model directly
        // and hash the password
        const { password, classId, ...userData } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                // If classId is provided, connect the student to that class
                classes: classId ? { connect: { id: classId } } : undefined,
            },
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.error("Create user error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
};

export default handler;
