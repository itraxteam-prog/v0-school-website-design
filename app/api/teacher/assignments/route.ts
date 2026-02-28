export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await requireRole("TEACHER");
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        const assignments = await prisma.assignment.findMany({
            where: {
                classId: classId || undefined,
                class: {
                    teacherId: session?.user?.id
                }
            },
            include: {
                class: true,
            },
            orderBy: { createdAt: "desc" }
        });


        return NextResponse.json(assignments);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function POST(req: Request) {
    try {
        await requireRole("TEACHER");
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { title, description, dueDate, maxPoints, classId } = body;

        if (!title || !dueDate || !maxPoints || !classId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify teacher owns the class
        const classRecord = await prisma.class.findFirst({
            where: { id: classId, teacherId: session?.user?.id }
        });

        if (!classRecord) {
            return NextResponse.json({ error: "Unauthorized class access" }, { status: 403 });
        }

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                maxMarks: parseFloat(maxPoints),
                classId
            }
        });


        return NextResponse.json(assignment);
    } catch (error) {
        return handleAuthError(error);
    }
}

