import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const gradeEntrySchema = z.object({
    studentId: z.string(),
    marks: z.number().min(0).max(100),
})

const postSchema = z.object({
    classId: z.string(),
    subjectId: z.string(),
    term: z.string(),
    grades: z.array(gradeEntrySchema),
})

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
        const subjectId = searchParams.get("subjectId")
        const term = searchParams.get("term")

        if (!classId || !subjectId || !term) {
            return NextResponse.json({ error: "classId, subjectId, and term are required" }, { status: 400 })
        }

        // Verify teacher owns class
        const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
        if (!cls) {
            return NextResponse.json({ error: "Class not found or access denied" }, { status: 404 })
        }

        const grades = await prisma.grade.findMany({
            where: { classId, subjectId, term },
        })

        return NextResponse.json({ data: grades })
    } catch (error: any) {
        console.error("[GET /api/teacher/grades]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const parsed = postSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { classId, subjectId, term, grades } = parsed.data

        // Verify teacher owns this class
        const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
        if (!cls) {
            return NextResponse.json({ error: "Class not found or access denied" }, { status: 403 })
        }

        // Delete existing grades for this class/subject/term and recreate
        await prisma.grade.deleteMany({ where: { classId, subjectId, term } })

        await prisma.grade.createMany({
            data: grades.map((g) => ({
                studentId: g.studentId,
                classId,
                subjectId,
                term,
                marks: g.marks,
            })),
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "SAVE_GRADES",
                entity: "Grade",
                metadata: { classId, subjectId, term, count: grades.length },
            },
        })

        return NextResponse.json({ success: true, message: "Grades saved successfully" })
    } catch (error: any) {
        console.error("[POST /api/teacher/grades]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
