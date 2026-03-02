export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, handleAuthError } from "@/lib/auth-guard"
import { withTimeout } from "@/lib/server-timeout"
import { z } from "zod"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

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

            // Try to find final grades first
            const finalGrades = await prisma.grade.findMany({
                where: { classId, subjectId, term },
            })

            if (finalGrades.length > 0) {
                return finalGrades;
            }

            // Fallback to draft grades
            return prisma.grade.findMany({
                where: { classId, subjectId, term: `${term}-draft` },
            })
        })(), 8000, "GET /api/teacher/grades");

        return NextResponse.json({ data })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function POST(req: NextRequest) {
    const user = await requireServerAuth([Role.TEACHER, Role.ADMIN]);
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

            // Determine if this is a draft save or final submission
            const isDraft = term.endsWith("-draft");
            const cleanTerm = isDraft ? term.replace("-draft", "") : term;

            // Delete existing grades for this class/subject/term and recreate
            await prisma.$transaction(async (tx) => {
                // If saving final, clean up both final and draft records
                if (!isDraft) {
                    await tx.grade.deleteMany({
                        where: {
                            classId,
                            subjectId,
                            OR: [{ term }, { term: `${term}-draft` }]
                        }
                    });
                } else {
                    // If saving draft, only clean up previous drafts
                    await tx.grade.deleteMany({ where: { classId, subjectId, term } });
                }

                await tx.grade.createMany({
                    data: grades.map((g) => ({
                        studentId: g.studentId,
                        classId,
                        subjectId,
                        term: term, // Use the provided term (with or without -draft)
                        marks: g.marks,
                    })),
                });

                await tx.auditLog.create({
                    data: {
                        userId: session.user.id,
                        action: isDraft ? "SAVE_GRADE_DRAFT" : "SUBMIT_GRADES",
                        entity: "Grade",
                        metadata: { classId, subjectId, term, count: grades.length },
                    },
                });
            });
        })(), 8000, "POST /api/teacher/grades");

        return NextResponse.json({ success: true, message: "Grades saved successfully" })
    } catch (error: any) {
        return handleAuthError(error);
    }
}


