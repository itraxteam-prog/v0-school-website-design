import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { withTimeout } from "@/lib/server-timeout";

export async function GET() {
    try {
        const session = await requireRole("TEACHER");
        const teacherId = session.user.id;

        const data = await withTimeout(
            (async () => {
                // Get all classes for this teacher
                const classes = await prisma.class.findMany({
                    where: { teacherId },
                    include: {
                        _count: {
                            select: { students: true }
                        }
                    }
                });

                const performanceData = await Promise.all(classes.map(async (cls) => {
                    // Calculate Average Score
                    const grades = await prisma.grade.findMany({
                        where: { classId: cls.id },
                        select: { marks: true }
                    });

                    const avgScore = grades.length > 0
                        ? Math.round(grades.reduce((acc, g) => acc + g.marks, 0) / grades.length)
                        : 0;

                    // Calculate Attendance Percentage (Total attendance records / (Total students * unique dates with attendance))
                    // Simplified: Average of attendance per student for this class
                    const totalStudents = cls._count.students;

                    let attendancePercent = 0;
                    if (totalStudents > 0) {
                        const attendanceRecords = await prisma.attendance.findMany({
                            where: { classId: cls.id }
                        });

                        // Get unique dates where attendance was taken
                        const uniqueDates = new Set(attendanceRecords.map(a => a.date.toDateString())).size;

                        if (uniqueDates > 0) {
                            const presentCount = attendanceRecords.filter(a => a.status === "PRESENT").length;
                            attendancePercent = Math.round((presentCount / (totalStudents * uniqueDates)) * 100);
                        }
                    }

                    return {
                        class: cls.name,
                        avgScore,
                        attendance: attendancePercent
                    };
                }));

                return performanceData;
            })(),
            8000,
            "GET /api/teacher/performance"
        );

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
