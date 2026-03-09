import { NextResponse, NextRequest } from "next/server";
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { createPdf } from "@/lib/pdf/createPdf";
import { AdminAnalyticsPdf } from "@/lib/pdf/templates/AdminAnalyticsPdf";
import { StudentPerformanceReportPdf } from "@/lib/pdf/templates/StudentPerformanceReportPdf";
import { TeacherPerformanceReportPdf } from "@/lib/pdf/templates/TeacherPerformanceReportPdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";
import { checkExportRateLimit } from "@/lib/pdf/export-rate-limit";
import { createPdfResponse } from "@/lib/pdf/pdf-response";
import { assertNodeRuntime } from "@/lib/runtime-assert";
import { fetchReportData } from "@/lib/reports-utils";

const SCHOOL_NAME = "Vibe School Management System";

export async function GET(req: NextRequest) {
    try {
        assertNodeRuntime();
        const user = await exportGuard(["ADMIN"]);

        // Safety check for Redis - if credentials missing, skip rate limiting instead of crashing
        try {
            await checkExportRateLimit(user.id, user.role);
        } catch (rlError: any) {
            console.warn("Rate limiting failed, proceeding anyway:", rlError.message);
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "analytics";
        const term = searchParams.get("term") || undefined;
        const classId = searchParams.get("classId") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;

        const { data } = await fetchReportData({ term, classId, startDate, endDate });

        let pdfElement: React.ReactElement;
        let filename = `admin_report_${type}`;

        const generatedAt = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";

        switch (type) {
            case "student-performance":
                pdfElement = React.createElement(StudentPerformanceReportPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    userEmail: user.email ?? "unknown",
                    rows: data.studentPerformance,
                    title: "Student Performance Report"
                });
                break;
            case "teacher-performance":
                pdfElement = React.createElement(TeacherPerformanceReportPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    userEmail: user.email ?? "unknown",
                    rows: data.teacherPerformance,
                    title: "Teacher Performance Report"
                });
                break;
            case "attendance-report":
                // For now, reuse analytics for attendance as it contains attendance trends
                pdfElement = React.createElement(AdminAnalyticsPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    userEmail: user.email ?? "unknown",
                    stats: {
                        totalStudents: data.summary.totalStudents,
                        totalTeachers: data.summary.totalTeachers,
                        totalClasses: data.summary.totalClasses,
                        attendanceToday: data.summary.overallAttendance,
                    },
                    attendanceData: data.attendanceChart.map(day => ({ month: day.day, attendance: day.attendance })),
                    gradeDistribution: [],
                    enrollmentData: [],
                    subjectPerformance: [],
                });
                break;
            default:
                // Default to original analytics view
                pdfElement = React.createElement(AdminAnalyticsPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    userEmail: user.email ?? "unknown",
                    stats: {
                        totalStudents: data.summary.totalStudents,
                        totalTeachers: data.summary.totalTeachers,
                        totalClasses: data.summary.totalClasses,
                        attendanceToday: data.summary.overallAttendance,
                    },
                    attendanceData: data.attendanceChart.map(day => ({ month: day.day, attendance: day.attendance })),
                    gradeDistribution: [],
                    enrollmentData: [],
                    subjectPerformance: [],
                });
                break;
        }

        const pdfBuffer = await createPdf(pdfElement);

        await logAudit({
            userId: user.id,
            action: "PDF_EXPORT",
            entity: "REPORTS",
            metadata: {
                type,
                filters: { term, classId, startDate, endDate },
                timestamp: new Date().toISOString(),
            },
        });

        return createPdfResponse(pdfBuffer, filename);
    } catch (error: any) {
        console.error("[GET /api/admin/reports/export]", error);

        if (error.message === "PDF export rate limit exceeded. Please wait.") {
            return NextResponse.json(
                { error: error.message },
                { status: 429 }
            );
        }

        if (error.message === "Forbidden" || error.message === "Unauthorized") {
            return NextResponse.json(
                { error: error.message },
                { status: error.message === "Forbidden" ? 403 : 401 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


