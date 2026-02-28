import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { withTimeout } from "@/lib/server-timeout";
import { logger } from "@/lib/logger";

const getCachedStudentStats = unstable_cache(
    async (studentId: string) => {
        const [grades, attendance, announcements, assignments] = await Promise.all([
            prisma.grade.findMany({
                where: { studentId },
                orderBy: { term: "desc" }
            }),
            prisma.attendance.findMany({
                where: { studentId }
            }),
            prisma.announcement.findMany({
                where: {
                    OR: [
                        { targetRole: "ALL" },
                        { targetRole: "STUDENT" }
                    ]
                },
                take: 1,
                orderBy: { createdAt: "desc" }
            }),
            prisma.assignment.findMany({
                where: {
                    class: {
                        students: { some: { id: studentId } }
                    },
                    dueDate: { gte: new Date() }
                },
                take: 3,
                orderBy: { dueDate: "asc" }
            })
        ]);

        // Performance calculation
        const totalMarks = grades.reduce((acc, g) => acc + g.marks, 0);
        const performance = grades.length > 0 ? Math.round(totalMarks / grades.length) + "%" : "N/A";

        // Attendance calculation
        const presentCount = attendance.filter(a => a.status === "PRESENT").length;
        const attendancePercent = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) + "%" : "N/A";

        // Performance Trend (Last 6 months)
        const performanceTrend = Object.entries(
            grades.reduce((acc: any, g) => {
                const month = g.createdAt.toLocaleString('default', { month: 'short' });
                if (!acc[month]) acc[month] = { total: 0, count: 0 };
                acc[month].total += g.marks;
                acc[month].count++;

                return acc;
            }, {})
        ).map(([month, stats]: [string, any]) => ({
            month,
            score: Math.round(stats.total / stats.count)
        })).slice(-6);

        // Subject Comparison
        const subjectComparison = Object.entries(
            grades.reduce((acc: any, g) => {
                const subj = g.subjectId;
                if (!acc[subj]) acc[subj] = { total: 0, count: 0 };
                acc[subj].total += g.marks;
                acc[subj].count++;

                return acc;
            }, {})
        ).map(([subject, stats]: [string, any]) => ({
            subject,
            score: Math.round(stats.total / stats.count)
        }));

        return {
            stats: {
                performance,
                attendance: attendancePercent,
                totalSubjects: [...new Set(grades.map(g => g.subjectId))].length,
                assignments: assignments.length
            },
            recentGrades: grades.slice(0, 5).map(g => ({
                sub: g.subjectId,
                type: g.term,
                date: g.createdAt.toLocaleDateString(),
                marks: g.marks,
                grade: g.marks >= 90 ? "A+" : g.marks >= 80 ? "A" : g.marks >= 70 ? "B" : "C"
            })),

            announcement: announcements[0] || null,
            upcomingEvents: assignments.map(a => ({
                title: a.title,
                type: "Assignment",
                date: a.dueDate.toLocaleDateString()
            })),
            performanceTrend,
            subjectComparison
        };
    },
    ['student-stats'],
    { revalidate: 60, tags: ['stats'] }
);

export async function GET() {
    try {
        const session = await requireRole("STUDENT");

        const data = await withTimeout(
            getCachedStudentStats(session.user.id),
            8000,
            "GET /api/student/stats"
        );

        return NextResponse.json(data);

    } catch (error: any) {
        logger.error({
            error: error.message,
            studentId: error.userId,
            context: "GET /api/student/stats"
        }, "Student stats fetch failed");

        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: error.status || 500 }
        );
    }
}

