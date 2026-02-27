import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP } from "@/lib/rate-limit"
import { logAudit } from "@/lib/audit"
import { assertAdmin } from "@/lib/assert-role"
import { handleAuthError } from "@/lib/auth-guard"
import { z } from "zod"

const updateRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
}).strict()

export async function POST(req: NextRequest) {
    try {
        const session = await assertAdmin();

        const ip = getIP(req)
        const { success } = await rateLimit(ip, "mutation")
        if (!success) {
            throw new Error("TOO_MANY_REQUESTS");
        }

        const body = await req.json()
        const parsed = updateRoleSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        const { userId, role } = parsed.data

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                role: true,
            },
        })

        await logAudit({
            userId: session.user.id,
            action: "UPDATE_USER_ROLE",
            entity: "User",
            entityId: userId,
            metadata: { newRole: role, affectedUser: updated.email },
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        return handleAuthError(error);
    }
}
