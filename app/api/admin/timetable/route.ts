export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { DayOfWeek } from "@prisma/client";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";

const timetableSchema = z.object({
    dayOfWeek: z.nativeEnum(DayOfWeek),
    startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid start time format (HH:mm)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid end time format (HH:mm)"),
    subjectName: z.string().min(1),
    room: z.string().optional().nullable(),
    classId: z.string().uuid(),
    teacherId: z.string().uuid(),
    term: z.string().optional().nullable(),
    academicYear: z.string().optional().nullable(),
    name: z.string().optional(), // Allow but don't require
}).passthrough(); // Use passthrough to allow extra fields like 'name' from UI

export async function GET() {
    try {
        await assertAdmin();

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
        await assertAdmin();
        const body = await req.json();

        const validated = timetableSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const { name: _, ...prismaData } = validated.data;

        const entry = await prisma.timetable.create({
            data: prismaData,
        });

        return NextResponse.json(entry);
    } catch (error) {
        return handleAuthError(error);
    }
}

