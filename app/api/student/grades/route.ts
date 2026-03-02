export const runtime = "nodejs";
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

        const grades = await prisma.grade.findMany({
            where: {
                studentId: session.user.id,
                NOT: { term: { endsWith: "-draft" } }
            },
            include: { class: { select: { name: true, subject: true } } },
            orderBy: { class: { createdAt: "desc" } },
        })

        const formatted = grades.map((g) => {
            const score = g.marks
            let grade = "F"
            if (score >= 90) grade = "A+"
            else if (score >= 80) grade = "A"
            else if (score >= 70) grade = "B"
            else if (score >= 60) grade = "C"
            else if (score >= 40) grade = "D"
            else grade = "F"

            return {
                id: g.id,
                subject: g.class?.subject || g.subjectId,
                className: g.class?.name,
                term: g.term,
                marks: `${g.marks}/100`,
                total: 100,
                grade,
                classId: g.classId,
            }
        })

        return NextResponse.json({ data: formatted })
    } catch (error: any) {
        console.error("[GET /api/student/grades]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

