import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const classId = searchParams.get("classId")

        if (!classId) {
            return NextResponse.json({ error: "classId is required" }, { status: 400 })
        }

        // Verify this teacher owns the class
        const cls = await prisma.class.findFirst({
            where: { id: classId, teacherId: session.user.id },
        })

        if (!cls) {
            return NextResponse.json({ error: "Class not found or access denied" }, { status: 404 })
        }

        const students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                classes: { some: { id: classId } },
            },
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" },
        })

        const formatted = students.map((s, index) => ({
            id: s.id,
            name: s.name || s.email || "Unknown",
            rollNo: String(index + 1).padStart(3, "0"),
            classId,
        }))

        return NextResponse.json({ data: formatted })
    } catch (error: any) {
        console.error("[GET /api/teacher/students]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
