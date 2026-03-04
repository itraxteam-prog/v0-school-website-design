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
                class: { select: { name: true } },
                submission: { select: { assignment: { select: { title: true } } } }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(grades);
    } catch (error) {
        return handleAuthError(error);
    }
}
