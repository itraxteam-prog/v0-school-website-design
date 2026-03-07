export const dynamic = 'force-dynamic';
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

        const [grades, studentWithClass] = await Promise.all([
            prisma.grade.findMany({
                where: {
                    studentId: session.user.id,
                    NOT: { term: { endsWith: "-draft" } }
                },
                include: { class: true },
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.findUnique({
                where: { id: session.user.id },
                select: {
                    classes: {
                        take: 1
                    }
                }
            })
        ])

        const assignedClass = studentWithClass?.classes?.[0] || null
        const classSubjects = (assignedClass?.subjects as string || "").split(',').map((s: string) => s.trim()).filter(Boolean)

        const formatted = grades.map((g) => {
            const score = g.marks
            let grade = "F"
            if (score >= 90) grade = "A+"
            else if (score >= 80) grade = "A"
            else if (score >= 70) grade = "B"
            else if (score >= 60) grade = "C"
            else if (score >= 40) grade = "D"
            else grade = "F"

            // Try to find the original subject name from the classSubjects list that matches the slug subjectId
            const subjectName = classSubjects.find((s: string) => s.toLowerCase().replace(/\s+/g, '-') === g.subjectId) || g.subjectId

            return {
                id: g.id,
                subject: subjectName,
                className: g.class?.name,
                term: g.term,
                marks: g.marks,
                total: 100,
                grade,
                classId: g.classId,
                date: g.createdAt.toISOString()
            }
        })

        const uniqueTerms = Array.from(new Set(formatted.map(g => g.term)))

        return NextResponse.json({
            data: formatted,
            subjects: ["All Subjects", ...classSubjects],
            terms: ["All Terms", ...uniqueTerms]
        })
    } catch (error: any) {
        console.error("[GET /api/student/grades]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

