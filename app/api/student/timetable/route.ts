import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await requireRole("STUDENT");

        // Get the classes the student is enrolled in
        const userWithClasses = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                classes: {
                    select: { id: true }
                }
            }
        });

        if (!userWithClasses || userWithClasses.classes.length === 0) {
            return NextResponse.json([]);
        }

        const classIds = userWithClasses.classes.map(c => c.id);

        const timetable = await prisma.timetable.findMany({
            where: {
                classId: { in: classIds }
            },
            include: {
                teacher: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                class: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
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
