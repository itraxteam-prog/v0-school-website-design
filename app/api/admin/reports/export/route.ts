export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { AdminAnalyticsPdf } from "@/lib/pdf/templates/AdminAnalyticsPdf";
import React from "react";

export async function GET() {
    try {
        await requireRole("ADMIN");

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

        const filename = `admin_analytics_${Date.now()}.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        return handleAuthError(error);
    }
}
