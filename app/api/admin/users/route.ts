import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, handleAuthError } from "@/lib/auth-guard"
import { withTimeout } from "@/lib/server-timeout"
import { rateLimit, getIP } from "@/lib/rate-limit"
import { logAudit } from "@/lib/audit"
import { z } from "zod"

export async function GET() {
    try {
        await requireRole("ADMIN");

        const users = await withTimeout(
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            8000,
            "GET /api/admin/users"
        );

        return NextResponse.json(users)
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await requireRole("ADMIN");

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

        await withTimeout((async () => {
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
        })(), 8000, "DELETE /api/admin/users");

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

