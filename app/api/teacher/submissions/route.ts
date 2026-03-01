import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const user = await requireServerAuth([Role.ADMIN, Role.TEACHER]);

        const url = new URL(req.url);
        const assignmentId = url.searchParams.get("assignmentId");
        const classId = url.searchParams.get("classId");

        const assignmentFilter: Record<string, any> = {};

        if (assignmentId) {
            assignmentFilter.id = assignmentId;
        }

        if (classId) {
            assignmentFilter.classId = classId;
        }

        if (user.role === Role.TEACHER) {
            assignmentFilter.class = {
                teacherId: user.id,
            };
        }

        const whereClause: Record<string, any> = {};

        if (Object.keys(assignmentFilter).length > 0) {
            whereClause.assignment = assignmentFilter;
        } else if (user.role === Role.TEACHER) {
            whereClause.assignment = {
                class: {
                    teacherId: user.id,
                },
            };
        }

        const submissions = await prisma.submission.findMany({
            where: whereClause,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
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
        console.error("[GET /api/teacher/submissions]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
