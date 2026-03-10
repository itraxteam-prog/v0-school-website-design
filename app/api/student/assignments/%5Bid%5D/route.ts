export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const assignmentId = params.id;

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: {
                class: {
                    select: { name: true }
                },
                submissions: {
                    where: { studentId: session.user.id },
                    include: {
                        grade: true
                    }
                }
            }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        // Verify student is in the class
        const enrollment = await prisma.user.findFirst({
            where: {
                id: session.user.id,
                classes: { some: { id: assignment.classId } }
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: "Forbidden: You are not enrolled in this class" }, { status: 403 });
        }

        return NextResponse.json(assignment);
    } catch (error) {
        console.error("[GET /api/student/assignments/[id]]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
