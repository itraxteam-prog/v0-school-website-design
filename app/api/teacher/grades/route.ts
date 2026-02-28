export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, handleAuthError } from "@/lib/auth-guard"
import { withTimeout } from "@/lib/server-timeout"
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
        const session = await requireRole("TEACHER");

        const { searchParams } = new URL(req.url)
        const classId = searchParams.get("classId")
        const subjectId = searchParams.get("subjectId")
        const term = searchParams.get("term")

        if (!classId || !subjectId || !term) {
            return NextResponse.json({ error: "classId, subjectId, and term are required" }, { status: 400 })
        }

        const data = await withTimeout((async () => {
            // Verify teacher owns class
            const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
            if (!cls) {
                throw new Error("FORBIDDEN");
            }

            return prisma.grade.findMany({
                where: { classId, subjectId, term },
            })
        })(), 8000, "GET /api/teacher/grades");

        return NextResponse.json({ data })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await requireRole("TEACHER");

        const body = await req.json()
        const parsed = postSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { classId, subjectId, term, grades } = parsed.data

        await withTimeout((async () => {
            // Verify teacher owns this class
            const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
            if (!cls) {
                throw new Error("FORBIDDEN");
            }

            // Delete existing grades for this class/subject/term and recreate
            await prisma.$transaction([
                prisma.grade.deleteMany({ where: { classId, subjectId, term } }),
                prisma.grade.createMany({
                    data: grades.map((g) => ({
                        studentId: g.studentId,
                        classId,
                        subjectId,
                        term,
                        marks: g.marks,
                    })),
                }),
                prisma.auditLog.create({
                    data: {
                        userId: session.user.id,
                        action: "SAVE_GRADES",
                        entity: "Grade",
                        metadata: { classId, subjectId, term, count: grades.length },
                    },
                })
            ]);
        })(), 8000, "POST /api/teacher/grades");

        return NextResponse.json({ success: true, message: "Grades saved successfully" })
    } catch (error: any) {
        return handleAuthError(error);
    }
}


