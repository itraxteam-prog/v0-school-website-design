import { NextResponse, NextRequest } from "next/server";
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { createPdf } from "@/lib/pdf/createPdf";
import { AdminAnalyticsPdf } from "@/lib/pdf/templates/AdminAnalyticsPdf";
import { StudentPerformanceReportPdf } from "@/lib/pdf/templates/StudentPerformanceReportPdf";
import { TeacherPerformanceReportPdf } from "@/lib/pdf/templates/TeacherPerformanceReportPdf";
import { ClassSummaryReportPdf } from "@/lib/pdf/templates/ClassSummaryReportPdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";
import { checkExportRateLimit } from "@/lib/pdf/export-rate-limit";
import { createPdfResponse } from "@/lib/pdf/pdf-response";
import { assertNodeRuntime } from "@/lib/runtime-assert";
import { fetchReportData } from "@/lib/reports-utils";
import { getSchoolLogo } from "@/lib/pdf/pdf-assets";
import { prisma } from "@/lib/prisma";

const SCHOOL_NAME = "The Pioneers High School";

export async function GET(req: NextRequest) {
    try {
        assertNodeRuntime();
        const user = await exportGuard(["ADMIN"]);

        // Rate limiting is now internally guarded for missing Redis credentials
        await checkExportRateLimit(user.id, user.role);

        const { searchParams } = req.nextUrl;
        const type = searchParams.get("type") || "analytics";
        const term = searchParams.get("term") || undefined;
        const classId = searchParams.get("classId") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;

        const { data } = await fetchReportData({ term, classId, startDate, endDate });

        const logoUrl = await getSchoolLogo();

        let pdfElement: React.ReactElement;
        const filename = `admin_report_${type}`;
        const generatedAt = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";

        switch (type) {
            case "student-performance":
                pdfElement = React.createElement(StudentPerformanceReportPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    logoUrl,
                    userEmail: user.email ?? "unknown",
                    rows: data.studentPerformance,
                    title: "Student Performance Report"
                });
                break;
            case "teacher-performance":
                pdfElement = React.createElement(TeacherPerformanceReportPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    logoUrl,
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
                    logoUrl,
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
            case "class-summary": {
                // Look up class name for the header
                let className = "All Classes";
                if (classId && classId !== "all") {
                    const cls = await prisma.class.findUnique({ where: { id: classId }, select: { name: true } });
                    className = cls?.name ?? "Unknown Class";
                }
                pdfElement = React.createElement(ClassSummaryReportPdf, {
                    generatedAt,
                    schoolName: SCHOOL_NAME,
                    logoUrl,
                    userEmail: user.email ?? "unknown",
                    rows: data.studentPerformance,
                    className,
                    term: term ?? "All Terms",
                });
                break;
            }
            default:
                return NextResponse.json(
                    { error: "Invalid report type", message: `Unknown type: "${type}". Valid types are: student-performance, teacher-performance, attendance-report, class-summary.` },
                    { status: 400 }
                );
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
        // Detailed logging to help identify the 500 cause
        console.error("[CRITICAL] PDF Export Failure:", {
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
        });

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
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
