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

        const attendance = await prisma.attendance.findMany({
            where: { studentId },
            include: {
                class: { select: { name: true } }
            },
            orderBy: { date: "desc" }
        });

        return NextResponse.json(attendance);
    } catch (error) {
        return handleAuthError(error);
    }
}
