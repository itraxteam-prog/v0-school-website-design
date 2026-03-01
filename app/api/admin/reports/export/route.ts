import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { AdminAnalyticsPdf } from "@/lib/pdf/templates/AdminAnalyticsPdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";
import { checkExportRateLimit } from "@/lib/pdf/export-rate-limit";
import { createPdfResponse } from "@/lib/pdf/pdf-response";
import { assertNodeRuntime } from "@/lib/runtime-assert";

const SCHOOL_NAME = "Vibe School Management System";

export async function GET() {
    try {
        assertNodeRuntime();
        const user = await exportGuard(["ADMIN"]);
        await checkExportRateLimit(user.id, user.role);

        // Fetch the same data that the /api/admin/analytics route computes
        const [
            attendance,
            grades,
            students,
            subjectGrades,
            totalStudents,
            totalTeachers,
            totalClasses,
            attendanceToday,
        ] = await Promise.all([
            prisma.attendance.findMany({
                select: { date: true, status: true },
                orderBy: { date: "asc" },
            }),
            prisma.grade.findMany({ select: { marks: true } }),
            prisma.user.findMany({
                where: { role: "STUDENT" },
                select: { createdAt: true },
            }),
            prisma.grade.findMany({ select: { subjectId: true, marks: true } }),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "TEACHER" } }),
            prisma.class.count(),
            prisma.attendance.count({
                where: {
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
        ]);

        // Monthly attendance rate
        const attendanceMap: Record<string, { count: number; present: number }> = {};
        attendance.forEach((a) => {
            const month = a.date.toLocaleString("default", { month: "short" });
            if (!attendanceMap[month]) attendanceMap[month] = { count: 0, present: 0 };
            attendanceMap[month].count++;
            if (a.status === "PRESENT") attendanceMap[month].present++;
        });
        const attendanceData = Object.entries(attendanceMap)
            .map(([month, stats]) => ({
                month,
                attendance: Math.round((stats.present / stats.count) * 100),
            }))
            .slice(-6);

        // Grade distribution
        const gradeCounts: Record<string, number> = { "A+": 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
        grades.forEach((g) => {
            const grade =
                g.marks >= 90 ? "A+" :
                    g.marks >= 80 ? "A" :
                        g.marks >= 70 ? "B" :
                            g.marks >= 60 ? "C" :
                                g.marks >= 50 ? "D" : "F";
            const key = grade.startsWith("A") ? (grade === "A+" ? "A+" : "A") : grade;
            if (gradeCounts[key] !== undefined) gradeCounts[key]++;
        });
        const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count }));

        // Enrollment by year
        const enrollmentMap: Record<string, number> = {};
        students.forEach((s) => {
            const year = s.createdAt.getFullYear().toString();
            enrollmentMap[year] = (enrollmentMap[year] || 0) + 1;
        });
        const enrollmentData = Object.entries(enrollmentMap)
            .map(([year, count]) => ({ year, students: count }))
            .sort((a, b) => parseInt(a.year) - parseInt(b.year));

        // Subject performance
        const subjectMap: Record<string, { total: number; count: number }> = {};
        subjectGrades.forEach((g) => {
            if (!subjectMap[g.subjectId]) subjectMap[g.subjectId] = { total: 0, count: 0 };
            subjectMap[g.subjectId].total += g.marks;
            subjectMap[g.subjectId].count++;
        });
        const subjectPerformance = Object.entries(subjectMap).map(([subject, stats]) => ({
            subject,
            avg: Math.round(stats.total / stats.count),
        }));

        const todayRate =
            totalStudents > 0
                ? `${Math.round((attendanceToday / totalStudents) * 100)}%`
                : "0%";

        const pdfBuffer = await createPdf(
            React.createElement(AdminAnalyticsPdf, {
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                schoolName: SCHOOL_NAME,
                userEmail: user.email ?? "unknown",
                stats: {
                    totalStudents,
                    totalTeachers,
                    totalClasses,
                    attendanceToday: todayRate,
                },
                attendanceData: attendanceData.length > 0 ? attendanceData : [{ month: "N/A", attendance: 0 }],
                gradeDistribution,
                enrollmentData: enrollmentData.length > 0 ? enrollmentData : [{ year: new Date().getFullYear().toString(), students: totalStudents }],
                subjectPerformance,
            })
        );

        await logAudit({
            userId: user.id,
            action: "PDF_EXPORT",
            entity: "REPORTS",
            metadata: {
                type: "analytics",
                timestamp: new Date().toISOString(),
            },
        });

        const filename = `admin_analytics`;

        return createPdfResponse(pdfBuffer, filename);
    } catch (error: any) {
        console.error("[GET /api/admin/reports/export]", error);

        if (error.message === "PDF export rate limit exceeded. Please wait.") {
            return NextResponse.json(
                { error: error.message },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: error.message === "Forbidden" ? "Forbidden" : "Unauthorized" },
            { status: error.message === "Forbidden" ? 403 : 401 }
        );
    }
}


