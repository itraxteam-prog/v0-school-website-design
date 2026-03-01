import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/server-auth";
import { Role, SubmissionStatus } from "@prisma/client";
import { z } from "zod";

export const runtime = "nodejs";

const createSubmissionSchema = z.object({
    content: z.string().min(1, "Content is required"),
    assignmentId: z.string().min(1, "Assignment ID is required"),
});

export async function POST(req: Request) {
    try {
        const user = await requireServerAuth([Role.STUDENT]);

        const body = await req.json();
        const parsed = createSubmissionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", details: parsed.error.format() },
                { status: 400 }
            );
        }

        const { content, assignmentId } = parsed.data;

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: {
                class: {
                    include: {
                        students: {
                            where: { id: user.id },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        if (assignment.class.students.length === 0) {
            return NextResponse.json(
                { error: "Forbidden: You are not enrolled in this class" },
                { status: 403 }
            );
        }

        const existingSubmission = await prisma.submission.findFirst({
            where: {
                assignmentId,
                studentId: user.id,
            },
        });

        if (existingSubmission) {
            return NextResponse.json(
                { error: "You have already submitted this assignment" },
                { status: 400 }
            );
        }

        const isLate = new Date() > assignment.dueDate;

        const submission = await prisma.submission.create({
            data: {
                content,
                status: isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED,
                studentId: user.id,
                assignmentId,
            },
        });

        return NextResponse.json(submission, { status: 201 });
    } catch (error: any) {
        if (error?.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        console.error("[POST /api/student/submissions]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await requireServerAuth([Role.STUDENT]);

        const url = new URL(req.url);
        const assignmentId = url.searchParams.get("assignmentId");

        const whereClause: Record<string, any> = {
            studentId: user.id,
        };

        if (assignmentId) {
            whereClause.assignmentId = assignmentId;
        }

        const submissions = await prisma.submission.findMany({
            where: whereClause,
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        dueDate: true,
                        maxMarks: true,
                        class: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                grade: {
                    select: {
                        id: true,
                        marks: true,
                        term: true,
                    },
                },
            },
            orderBy: { submittedAt: "desc" },
        });

        return NextResponse.json(submissions);
    } catch (error: any) {
        if (error?.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        console.error("[GET /api/student/submissions]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
