export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== Role.TEACHER) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const assignmentId = params.id;

        const submissions = await prisma.submission.findMany({
            where: {
                assignmentId,
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                grade: true,
            },
            orderBy: {
                submittedAt: "desc",
            },
        });

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("[GET /api/teacher/assignments/[id]/submissions]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
