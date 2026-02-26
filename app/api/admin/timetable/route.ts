import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { DayOfWeek } from "@prisma/client";

export async function GET() {
    try {
        await requireRole("ADMIN");

        const timetable = await prisma.timetable.findMany({
            include: {
                class: true,
                teacher: true,
            },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" },
            ],
        });

        return NextResponse.json(timetable);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function POST(req: Request) {
    try {
        await requireRole("ADMIN");
        const body = await req.json();
        const { dayOfWeek, startTime, endTime, subjectName, room, classId, teacherId, term, academicYear } = body;

        if (!dayOfWeek || !startTime || !endTime || !subjectName || !classId || !teacherId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const entry = await prisma.timetable.create({
            data: {
                dayOfWeek: dayOfWeek as DayOfWeek,
                startTime,
                endTime,
                subjectName,
                room,
                classId,
                teacherId,
                term,
                academicYear,
            },
        });

        return NextResponse.json(entry);
    } catch (error) {
        return handleAuthError(error);
    }
}
