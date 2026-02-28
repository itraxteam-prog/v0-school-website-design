export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // teacherId is non-nullable in schema — delete associated classes first
        // (cascade removes attendance & grade records for those classes)
        await prisma.class.deleteMany({
            where: { teacherId: params.id },
        })

        await prisma.user.delete({ where: { id: params.id } })

        await logAudit({
            userId: session.user.id,
            action: "DELETE_TEACHER",
            entity: "User",
            entityId: params.id,
            metadata: { deletedBy: session.user.email },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[DELETE /api/admin/teachers/:id]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
