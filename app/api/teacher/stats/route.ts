import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { withTimeout } from "@/lib/server-timeout";
import { logger } from "@/lib/logger";

const getCachedTeacherStats = unstable_cache(
    async (teacherId: string) => {
        // 1. Get classes taught by this teacher
        const classes = await prisma.class.findMany({
            where: { teacherId },
            include: {
                _count: {
                    select: { students: true }
                }
            }
        });

        const totalClasses = classes.length;
        const totalStudents = classes.reduce((acc, c) => acc + c._count.students, 0);

        // 2. Attendance Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendanceToday = await prisma.attendance.count({
            where: {
                classId: { in: classes.map(c => c.id) },
                date: { gte: startOfDay, lte: endOfDay }
            }
        });

        const attendancePercent = totalStudents > 0 ? Math.round((attendanceToday / totalStudents) * 100) : 0;

        // 3. Pending Grades: Submissions that are SUBMITTED or LATE but don't have a grade
        const pendingGrades = await prisma.submission.count({
            where: {
                assignment: { classId: { in: classes.map(c => c.id) } },
                status: { in: ["SUBMITTED", "LATE"] },
                grade: null
            }
        });

        return {
            stats: {
                totalClasses,
                totalStudents,
                attendanceToday: `${attendancePercent}%`,
                pendingGrades
            }
        };
    },
    ['teacher-stats'],
    { revalidate: 60, tags: ['stats'] }
);

export async function GET() {
    try {
        const session = await requireRole("TEACHER");

        const data = await withTimeout(
            getCachedTeacherStats(session.user.id),
            8000,
            "GET /api/teacher/stats"
        );

        return NextResponse.json(data);
    } catch (error: any) {
        logger.error({
            error: error.message,
            teacherId: error.userId,
            context: "GET /api/teacher/stats"
        }, "Teacher stats fetch failed");

        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: error.status || 500 }
        );
    }
}

