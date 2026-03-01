import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";
import { z } from "zod";

export const runtime = "nodejs";

const createAssignmentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.coerce.date(),
    maxMarks: z.coerce.number().min(0).default(100),
    classId: z.string().min(1, "Class ID is required"),
});

export async function POST(req: Request) {
    try {
        const user = await requireServerAuth([Role.ADMIN, Role.TEACHER]);

        const body = await req.json();
        const parsed = createAssignmentSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", details: parsed.error.format() },
                { status: 400 }
            );
        }

        const { title, description, dueDate, maxMarks, classId } = parsed.data;

        if (user.role === Role.TEACHER) {
            const classRecord = await prisma.class.findUnique({
                where: { id: classId },
            });
            if (!classRecord || classRecord.teacherId !== user.id) {
                return NextResponse.json(
                    { error: "Forbidden: You do not teach this class" },
                    { status: 403 }
                );
            }
        }

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate,
                maxMarks,
                classId,
            },
        });

        return NextResponse.json(assignment, { status: 201 });
    } catch (error: any) {
        if (error?.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        console.error("[POST /api/teacher/assignments]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await requireServerAuth([Role.ADMIN, Role.TEACHER]);

        const url = new URL(req.url);
        const classId = url.searchParams.get("classId");

        const whereClause: Record<string, any> = {};

        if (classId) {
            whereClause.classId = classId;
        }

        if (user.role === Role.TEACHER) {
            whereClause.class = {
                teacherId: user.id,
            };
        }

        const assignments = await prisma.assignment.findMany({
            where: whereClause,
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        subject: true,
                    },
                },
                _count: {
                    select: { submissions: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(assignments);
    } catch (error: any) {
        if (error?.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        console.error("[GET /api/teacher/assignments]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
