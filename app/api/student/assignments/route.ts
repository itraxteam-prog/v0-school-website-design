export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get student with their classes
        const student = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                classes: {
                    select: { id: true }
                }
            }
        });

        if (!student || student.classes.length === 0) {
            return NextResponse.json([]);
        }

        const classIds = student.classes.map(c => c.id);

        // Fetch assignments for these classes
        const assignments = await prisma.assignment.findMany({
            where: {
                classId: { in: classIds }
            },
            include: {
                class: {
                    select: { name: true }
                },
                submissions: {
                    where: { studentId: session.user.id },
                    select: { id: true, status: true, submittedAt: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(assignments);
    } catch (error) {
        console.error("[GET /api/student/assignments]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
