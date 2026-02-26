import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await requireRole("TEACHER");

        const timetable = await prisma.timetable.findMany({
            where: {
                teacherId: session.user.id,
            },
            include: {
                class: true,
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
