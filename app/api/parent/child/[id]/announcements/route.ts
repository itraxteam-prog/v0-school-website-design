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

        const announcements = await prisma.announcement.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { targetRole: "ALL" },
                            { targetRole: "STUDENT" }
                        ]
                    },
                    {
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } }
                        ]
                    }
                ]
            },
            include: {
                author: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(announcements);
    } catch (error) {
        return handleAuthError(error);
    }
}
