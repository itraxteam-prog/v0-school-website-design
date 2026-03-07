import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { withTimeout } from "@/lib/server-timeout";
import { logger } from "@/lib/logger";

const getCachedStudentStats = unstable_cache(
    async (studentId: string) => {
        const [grades, attendance, announcements, assignments, studentWithClass] = await Promise.all([
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
            }),
            prisma.user.findUnique({
                where: { id: studentId },
                select: {
                    classes: {
                        include: {
                            teacher: { select: { name: true } }
                        },
                        take: 1
                    }
                }
            })
        ]);

        const assignedClass = studentWithClass?.classes?.[0] || null;
        const curriculum = (assignedClass?.subjects as string || "").split(',').map((s: string) => s.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean);

        // Filter grades to include only those that belong to the class curriculum
        const filteredGrades = grades.filter(g => curriculum.includes(g.subjectId.toLowerCase().replace(/\s+/g, '-')));

        // Performance calculation
        const totalMarks = filteredGrades.reduce((acc, g) => acc + g.marks, 0);
        const performance = filteredGrades.length > 0 ? Math.round(totalMarks / filteredGrades.length) + "%" : "N/A";

        // Attendance calculation
        const presentCount = attendance.filter(a => a.status === "PRESENT").length;
        const attendancePercent = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) + "%" : "N/A";

        // Performance Trend (Grouped by Assessment Period)
        const trendMap: Record<string, { total: number; count: number }> = {};
        filteredGrades.forEach((g) => {
            const period = g.term.replace(/-draft$/, "");
            if (!trendMap[period]) trendMap[period] = { total: 0, count: 0 };
            trendMap[period].total += g.marks;
            trendMap[period].count++;
        });

        const performanceTrend = Object.entries(trendMap)
            .map(([period, stats]) => {
                const name = period.split('-')[0];
                const readable = name.charAt(0).toUpperCase() + name.slice(1, 3);
                return {
                    month: readable,
                    score: Math.round(stats.total / stats.count)
                };
            })
            .slice(-6);

        // Subject Comparison
        const classSubs = (assignedClass?.subjects as string || "").split(',').map((s: string) => s.trim()) || [];
        const subjectComparison = Object.entries(
            filteredGrades.reduce((acc: any, g) => {
                const subName = classSubs.find((s: string) => s.toLowerCase().replace(/\s+/g, '-') === g.subjectId) || g.subjectId;
                if (!acc[subName]) acc[subName] = { total: 0, count: 0 };
                acc[subName].total += g.marks;
                acc[subName].count++;

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
                totalSubjects: assignedClass ? (assignedClass.subjects as string || "").split(',').filter(Boolean).length : 0,
                assignments: assignments.length
            },
            recentGrades: filteredGrades.slice(0, 5).map(g => {
                const classSubs = (assignedClass?.subjects as string)?.split(',').map((s: string) => s.trim()) || [];
                const subName = classSubs.find((s: string) => s.toLowerCase().replace(/\s+/g, '-') === g.subjectId) || g.subjectId;
                return {
                    sub: subName,
                    type: g.term,
                    date: g.createdAt.toLocaleDateString(),
                    marks: g.marks,
                    grade: g.marks >= 90 ? "A+" : g.marks >= 80 ? "A" : g.marks >= 70 ? "B" : "C"
                };
            }),

            announcement: announcements[0] || null,
            upcomingEvents: assignments.map(a => ({
                title: a.title,
                type: "Assignment",
                date: a.dueDate.toLocaleDateString()
            })),
            performanceTrend,
            subjectComparison,
            classInfo: assignedClass ? {
                name: assignedClass.name,
                teacher: assignedClass.teacher?.name || "Unassigned",
                subjects: assignedClass.subjects || "General"
            } : null
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
