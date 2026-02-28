export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { DayOfWeek } from "@prisma/client";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireRole("ADMIN");
        const { id } = params;
        const body = await req.json();

        const entry = await prisma.timetable.update({
            where: { id },
            data: {
                ...body,
                dayOfWeek: body.dayOfWeek ? (body.dayOfWeek as DayOfWeek) : undefined,
            },
        });

        return NextResponse.json(entry);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireRole("ADMIN");
        const { id } = params;

        await prisma.timetable.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleAuthError(error);
    }
}
