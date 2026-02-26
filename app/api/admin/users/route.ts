import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP } from "@/lib/rate-limit"
import { logAudit } from "@/lib/audit"
import { z } from "zod"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(users)
    } catch (error: any) {
        console.error("[GET /api/admin/users]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
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

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        const schema = z.object({
            id: z.string().uuid()
        })

        const parsed = schema.safeParse({ id })
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id: parsed.data.id },
        })

        await logAudit({
            userId: session.user.id,
            action: "DELETE_USER",
            entity: "User",
            entityId: parsed.data.id,
            metadata: { deletedBy: session.user.email },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[DELETE /api/admin/users]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
