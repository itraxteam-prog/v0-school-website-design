export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/server-auth";
import { handleAuthError } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireServerAuth([Role.PARENT]);
        const studentId = params.id;

        // Verify ownership
        const connection = await prisma.parentStudent.findFirst({
            where: {
                parent: { userId: session.id },
                studentId: studentId
            }
        });

        if (!connection) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const grades = await prisma.grade.findMany({
            where: { studentId },
            include: {
                class: { select: { name: true, subjects: true, subject: true } },
                submission: { select: { assignment: { select: { title: true } } } }
            },
            orderBy: { createdAt: "desc" }
        });

        const formatted = grades.map(g => {
            const classSubs = (g.class.subjects || g.class.subject || "").split(',').map(s => s.trim());
            const subjectName = classSubs.find(s => s.toLowerCase().replace(/\s+/g, '-') === g.subjectId) || g.subjectId;

            return {
                ...g,
                subjectName,
                total: 100
            }
        });

        return NextResponse.json(formatted);
    } catch (error) {
        return handleAuthError(error);
    }
}
