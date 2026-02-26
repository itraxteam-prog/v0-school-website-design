import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP } from "@/lib/rate-limit"
import { logAudit } from "@/lib/audit"
import { z } from "zod"

const updateRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const ip = getIP(req)
        const { success } = await rateLimit(ip, "mutation")
        if (!success) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 })
        }

        const body = await req.json()
        const parsed = updateRoleSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        const { userId, role } = parsed.data

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
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
        console.error("[POST /api/admin/users/update-role]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
