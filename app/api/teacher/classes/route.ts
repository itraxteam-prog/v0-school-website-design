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

        if (session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const classes = await prisma.class.findMany({
            where: { teacherId: session.user.id },
            include: {
                _count: { select: { students: true } },
            },
            orderBy: { createdAt: "desc" },
        })

        const formatted = classes.map((c) => ({
            id: c.id,
            name: c.name,
            subject: c.subject || "General",
            studentCount: c._count.students,
        }))

        return NextResponse.json({ data: formatted })
    } catch (error: any) {
        console.error("[GET /api/teacher/classes]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
