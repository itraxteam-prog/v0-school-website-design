import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "STUDENT") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const records = await prisma.attendance.findMany({
            where: { studentId: session.user.id },
            include: { class: { select: { name: true } } },
            orderBy: { date: "desc" },
        })

        const formatted = records.map((r) => ({
            id: `${r.studentId}-${r.classId}-${r.date.getTime()}`,
            date: r.date.toISOString().split("T")[0], // YYYY-MM-DD
            status: r.status.toLowerCase() as "present" | "absent" | "late",
            className: r.class?.name,
            classId: r.classId,
            remarks: r.remarks,
        }))

        return NextResponse.json({ data: formatted })
    } catch (error: any) {
        console.error("[GET /api/student/attendance]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
