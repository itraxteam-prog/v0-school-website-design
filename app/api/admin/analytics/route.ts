import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { withTimeout } from "@/lib/server-timeout";
import { logger } from "@/lib/logger";

const getAnalyticsData = async () => {
    const [attendance, grades, students, subjectGrades] = await Promise.all([
        prisma.attendance.findMany({
            select: { date: true, status: true },
            orderBy: { date: "asc" }
        }),
        prisma.grade.findMany({
            select: { marks: true }
        }),
        prisma.user.findMany({
            where: { role: "STUDENT" },
            select: { createdAt: true }
        }),
        prisma.grade.findMany({
            select: { subjectId: true, marks: true }
        })
    ]);

    const attendanceMap: Record<string, { count: number, present: number }> = {};
    attendance.forEach(a => {
        const month = a.date.toLocaleString('default', { month: 'short' });
        if (!attendanceMap[month]) attendanceMap[month] = { count: 0, present: 0 };
        attendanceMap[month].count++;
        if (a.status === "PRESENT") attendanceMap[month].present++;
    });

    const attendanceData = Object.entries(attendanceMap).map(([month, stats]) => ({
        month,
        attendance: Math.round((stats.present / stats.count) * 100)
    })).slice(-6);

    const gradeCounts: Record<string, number> = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    grades.forEach(g => {
        const grade = g.marks >= 90 ? "A+" : g.marks >= 80 ? "A" : g.marks >= 70 ? "B" : g.marks >= 60 ? "C" : g.marks >= 50 ? "D" : "F";
        const key = grade.startsWith('A') ? (grade === 'A+' ? 'A+' : 'A') : grade;
        if (gradeCounts[key] !== undefined) gradeCounts[key]++;
    });

    const gradeDistributionData = Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count }));

    const enrollmentMap: Record<string, number> = {};
    students.forEach(s => {
        const year = s.createdAt.getFullYear().toString();
        enrollmentMap[year] = (enrollmentMap[year] || 0) + 1;
    });

    const enrollmentData = Object.entries(enrollmentMap).map(([year, count]) => ({
        year,
        students: count
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));

    const subjectMap: Record<string, { total: number, count: number }> = {};
    subjectGrades.forEach(g => {
        if (!subjectMap[g.subjectId]) subjectMap[g.subjectId] = { total: 0, count: 0 };
        subjectMap[g.subjectId].total += g.marks;
        subjectMap[g.subjectId].count++;
    });

    const subjectPerformanceData = Object.entries(subjectMap).map(([subject, stats]) => ({
        subject,
        avg: Math.round(stats.total / stats.count)
    }));

    return {
        attendanceData: attendanceData.length > 0 ? attendanceData : [
            { month: 'Jan', attendance: 95 }, { month: 'Feb', attendance: 92 }
        ],
        gradeDistribution: gradeDistributionData,
        enrollmentData: enrollmentData.length > 0 ? enrollmentData : [
            { year: '2025', students: students.length }
        ],
        subjectPerformance: subjectPerformanceData
    };
};

export async function GET() {
    try {
        const session = await requireRole("ADMIN");

        const data = await withTimeout(
            getAnalyticsData(),
            8000,
            "GET /api/admin/analytics"
        );

        return NextResponse.json(data);
    } catch (error: any) {
        logger.error({
            error: error.message,
            stack: error.stack,
            context: "GET /api/admin/analytics"
        }, "Analytics fetch failed");

        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: error.status || 500 }
        );
    }
}

