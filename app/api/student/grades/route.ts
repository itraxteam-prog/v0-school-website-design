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
        const classSubjectsRaw = (assignedClass?.subjects as string || "").split(',').map((s: string) => s.trim()).filter(Boolean)
        const curriculumSlugs = classSubjectsRaw.map(s => s.toLowerCase().replace(/\s+/g, '-'))

        // Filter out grades that are not in the curriculum (e.g., legacy room numbers)
        const validGrades = grades.filter(g => curriculumSlugs.includes(g.subjectId.toLowerCase().replace(/\s+/g, '-')))

        const formatted = validGrades.map((g) => {
            const score = g.marks
            let grade = "F"
            if (score >= 90) grade = "A+"
            else if (score >= 80) grade = "A"
            else if (score >= 70) grade = "B"
            else if (score >= 60) grade = "C"
            else if (score >= 40) grade = "D"
            else grade = "F"

            // Try to find the original subject name from the classSubjects list that matches the slug subjectId
            const subjectName = classSubjectsRaw.find((s: string) => s.toLowerCase().replace(/\s+/g, '-') === g.subjectId) || g.subjectId

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

        const termMapping: Record<string, string> = {
            "september-2025": "September 2025",
            "october-2025": "October 2025",
            "november-2025": "November 2025",
            "mid-term": "Mid-Term Exam",
            "december-2025": "December 2025",
            "january-2026": "January 2026",
            "february-2026": "February 2026",
            "march-2026": "March 2026",
            "final-term": "Final Exam"
        };

        const uniqueTerms = Array.from(new Set(formatted.map(g => g.term)))
            .map(t => termMapping[t] || t);

        return NextResponse.json({
            data: formatted.map(g => ({ ...g, termDisplay: termMapping[g.term] || g.term })),
            subjects: ["All Subjects", ...classSubjectsRaw],
            terms: ["All Periods", ...uniqueTerms]
        })
    } catch (error: any) {
        console.error("[GET /api/student/grades]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

