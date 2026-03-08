import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextRequest, NextResponse } from "next/server";
import { withTimeout } from "@/lib/server-timeout";
import { logger } from "@/lib/logger";

const getAnalyticsData = async (filters: { classId?: string, year?: string, term?: string }) => {
    const { classId, year, term } = filters;
    const yearNum = year ? parseInt(year) : new Date().getFullYear();

    // Base where clauses
    const attendanceWhere: any = {
        date: {
            gte: new Date(`${yearNum}-01-01`),
            lte: new Date(`${yearNum}-12-31`)
        }
    };

    let gradeWhere: any = {};
    if (term) {
        // Handle both legacy (non-prefixed) and new (year-prefixed) terms
        gradeWhere = {
            OR: [
                { term: term },
                { term: `${yearNum}-${term}` }
            ]
        };
    } else {
        // If no term specified, we should still ideally filter by year if the data is prefixed
        // but since we don't have a dedicated Year field, we'll look for terms starting with the year
        gradeWhere = {
            term: {
                startsWith: yearNum.toString()
            }
        };
    }
    const enrollmentWhere: any = { role: "STUDENT" };

    if (classId && classId !== "all") {
        attendanceWhere.student = { classId };
        gradeWhere.student = { classId };
        enrollmentWhere.classId = classId;
    }

    const [attendance, grades, students, subjectGrades] = await Promise.all([
        prisma.attendance.findMany({
            where: attendanceWhere,
            select: { date: true, status: true },
            orderBy: { date: "asc" }
        }),
        prisma.grade.findMany({
            where: gradeWhere,
            select: { marks: true }
        }),
        prisma.user.findMany({
            where: enrollmentWhere,
            select: { createdAt: true }
        }),
        prisma.grade.findMany({
            where: gradeWhere,
            select: { subjectId: true, marks: true }
        })
    ]);

    // 1. Attendance Trends
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
    }));

    // 2. Grade Distribution
    const gradeCounts: Record<string, number> = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    grades.forEach(g => {
        const grade = g.marks >= 90 ? "A+" : g.marks >= 80 ? "A" : g.marks >= 70 ? "B" : g.marks >= 60 ? "C" : g.marks >= 50 ? "D" : "F";
        const key = (grade === "A" || grade === "A+") ? grade : grade;
        if (gradeCounts[key] !== undefined) gradeCounts[key]++;
    });
    const gradeDistributionData = Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count }));

    // 3. Enrollment Statistics
    const enrollmentMap: Record<string, number> = {};
    students.forEach(s => {
        const year = s.createdAt.getFullYear().toString();
        enrollmentMap[year] = (enrollmentMap[year] || 0) + 1;
    });
    const enrollmentData = Object.entries(enrollmentMap).map(([year, count]) => ({
        year,
        students: count
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));

    // 4. Subject-wise Performance
    const classes = await prisma.class.findMany({
        where: classId && classId !== "all" ? { id: classId } : {},
        select: { subjects: true }
    });

    // Create a map of valid subject slugs to readable names
    const curriculumMap: Record<string, string> = {};
    classes.forEach(c => {
        const subs = (c.subjects || "").split(',').map(s => s.trim()).filter(Boolean);
        subs.forEach(s => {
            const slug = s.toLowerCase().replace(/\s+/g, '-');
            curriculumMap[slug] = s;
        });
    });

    const subjectMap: Record<string, { total: number, count: number }> = {};
    subjectGrades.forEach(g => {
        const slug = g.subjectId.toLowerCase().replace(/\s+/g, '-');
        const readableName = curriculumMap[slug];

        // Only include grades belonging to the academic curriculum
        if (readableName) {
            if (!subjectMap[readableName]) subjectMap[readableName] = { total: 0, count: 0 };
            subjectMap[readableName].total += g.marks;
            subjectMap[readableName].count++;
        }
    });

    const subjectPerformanceData = Object.entries(subjectMap).map(([subject, stats]) => ({
        subject,
        avg: Math.round(stats.total / stats.count)
    }));

    return {
        attendanceData: attendanceData.length > 0 ? attendanceData : [],
        gradeDistribution: gradeDistributionData,
        enrollmentData: enrollmentData.length > 0 ? enrollmentData : [],
        subjectPerformance: subjectPerformanceData
    };
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filters = {
            classId: searchParams.get("classId") || undefined,
            year: searchParams.get("year") || undefined,
            term: searchParams.get("term") || undefined,
        };

        const session = await requireRole("ADMIN");

        const data = await withTimeout(
            getAnalyticsData(filters),
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

