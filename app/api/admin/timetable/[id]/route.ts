export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { DayOfWeek } from "@prisma/client";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";

const updateTimetableSchema = z.object({
    dayOfWeek: z.nativeEnum(DayOfWeek).optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).optional(),
    subjectName: z.string().min(1).optional(),
    room: z.string().optional().nullable(),
    classId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    term: z.string().optional().nullable(),
    academicYear: z.string().optional().nullable(),
}).passthrough();

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await assertAdmin();
        const { id } = params;
        const body = await req.json();

        const validated = updateTimetableSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const { name: _, ...prismaData } = validated.data;

        const entry = await prisma.timetable.update({
            where: { id },
            data: prismaData,
        });

        return NextResponse.json(entry);
    } catch (error) {
        console.error("PATCH /api/admin/timetable/:id error:", error)
        return handleAuthError(error);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await assertAdmin();
        const { id } = params;

        await prisma.timetable.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleAuthError(error);
    }
}
