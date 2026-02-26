import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Delete attendance/grades first or rely on cascade
        await prisma.attendance.deleteMany({ where: { studentId: params.id } })
        await prisma.grade.deleteMany({ where: { studentId: params.id } })

        await prisma.user.delete({ where: { id: params.id } })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[DELETE /api/admin/students/:id]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
