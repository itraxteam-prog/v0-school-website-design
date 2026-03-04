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

        // Verify ownership and get student classes
        const student = await prisma.user.findFirst({
            where: {
                id: studentId,
                linkedParents: { some: { parent: { userId: session.id } } }
            },
            include: {
                classes: { select: { id: true } }
            }
        });

        if (!student) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const classIds = student.classes.map(c => c.id);

        const timetable = await prisma.timetable.findMany({
            where: {
                classId: { in: classIds }
            },
            include: {
                class: { select: { name: true } },
                teacher: { select: { name: true } }
            },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" }
            ]
        });

        return NextResponse.json(timetable);
    } catch (error) {
        return handleAuthError(error);
    }
}
