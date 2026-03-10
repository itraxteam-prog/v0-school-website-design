export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";

const submitSchema = z.object({
    content: z.string().min(1, "Submission content is required"),
});

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const assignmentId = params.id;
        const body = await req.json();
        const parsed = submitSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        // Check if student is in the class
        const enrollment = await prisma.user.findFirst({
            where: {
                id: session.user.id,
                classes: { some: { id: assignment.classId } }
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Check for existing submission
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                assignmentId,
                studentId: session.user.id
            }
        });

        if (existingSubmission && existingSubmission.status === SubmissionStatus.GRADED) {
            return NextResponse.json({ error: "Cannot update a graded submission" }, { status: 400 });
        }

        const dueDate = new Date(assignment.dueDate);
        const status = new Date() > dueDate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED;

        let submission;
        if (existingSubmission) {
            submission = await prisma.submission.update({
                where: { id: existingSubmission.id },
                data: {
                    content: parsed.data.content,
                    status,
                    submittedAt: new Date()
                }
            });
        } else {
            submission = await prisma.submission.create({
                data: {
                    assignmentId,
                    studentId: session.user.id,
                    content: parsed.data.content,
                    status,
                    submittedAt: new Date()
                }
            });
        }

        return NextResponse.json(submission);
    } catch (error) {
        console.error("[POST /api/student/assignments/[id]/submit]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
