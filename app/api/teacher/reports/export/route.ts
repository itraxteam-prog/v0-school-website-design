import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { TeacherClassReportPdf } from "@/lib/pdf/templates/TeacherClassReportPdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";
import { checkExportRateLimit } from "@/lib/pdf/export-rate-limit";
import { createPdfResponse } from "@/lib/pdf/pdf-response";
import { assertNodeRuntime } from "@/lib/runtime-assert";

const SCHOOL_NAME = "Vibe School Management System";

/**
 * GET /api/teacher/reports/export
 *
 * Query params:
 *   classId   (required)
 *   type      "grades" | "attendance"  (required)
 *   subjectId (required when type=grades)
 *   term      (required when type=grades)
 */
export async function GET(req: NextRequest) {
    try {
        assertNodeRuntime();
        const user = await exportGuard(["TEACHER"]);
        await checkExportRateLimit(user.id, user.role);

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");
        const type = searchParams.get("type") as "grades" | "attendance" | null;

        if (!classId || !type || !["grades", "attendance"].includes(type)) {
            return NextResponse.json(
                { error: "classId and type (grades|attendance) are required" },
                { status: 400 }
            );
        }

        // Verify teacher owns this class
        const cls = await prisma.class.findFirst({
            where: { id: classId, teacherId: user.id },
        });

        if (!cls) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const teacherName = user.name ?? "Teacher";
        const subject = cls.subject ?? "General";

        let gradeRows: { studentName: string; marks: number; grade: string; term: string }[] = [];
        let attendanceRows: { studentName: string; date: string; status: string }[] = [];

        if (type === "grades") {
            const subjectId = searchParams.get("subjectId");
            const term = searchParams.get("term");

            if (!subjectId || !term) {
                return NextResponse.json(
                    { error: "subjectId and term are required for grades export" },
                    { status: 400 }
                );
            }

            let grades = await prisma.grade.findMany({
                where: { classId, subjectId, term },
                include: { student: { select: { name: true, email: true } } },
                orderBy: { student: { name: "asc" } },
            });

            // Fallback to drafts if no final grades
            if (grades.length === 0) {
                grades = await prisma.grade.findMany({
                    where: { classId, subjectId, term: `${term}-draft` },
                    include: { student: { select: { name: true, email: true } } },
                    orderBy: { student: { name: "asc" } },
                });
            }

            gradeRows = grades.map((g) => {
                const marks = g.marks;
                let grade = "F";
                if (marks >= 90) grade = "A+";
                else if (marks >= 80) grade = "A";
                else if (marks >= 70) grade = "B";
                else if (marks >= 60) grade = "C";
                else if (marks >= 40) grade = "D";
                else grade = "F";
                return {
                    studentName: g.student?.name ?? g.student?.email ?? "Unknown",
                    marks,
                    grade,
                    term: g.term,
                };
            });
        } else {
            // attendance: fetch all attendance for this class ordered by date then student
            const records = await prisma.attendance.findMany({
                where: { classId },
                include: {
                    // Attendance model doesn't have a student relation — we join via User
                },
                orderBy: [{ date: "desc" }],
            });

            // Resolve student names in one query
            const studentIds = [...new Set(records.map((r) => r.studentId))];
            const students = await prisma.user.findMany({
                where: { id: { in: studentIds } },
                select: { id: true, name: true, email: true },
            });
            const studentMap = new Map(students.map((s) => [s.id, s.name ?? s.email ?? "Unknown"]));

            attendanceRows = records.map((r) => ({
                studentName: studentMap.get(r.studentId) ?? "Unknown",
                date: r.date.toISOString().split("T")[0],
                status: r.status,
            }));
        }

        const pdfBuffer = await createPdf(
            React.createElement(TeacherClassReportPdf, {
                teacherName,
                schoolName: SCHOOL_NAME,
                userEmail: user.email ?? "unknown",
                className: cls.name,
                subject,
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                reportType: type,
                grades: gradeRows,
                attendance: attendanceRows,
            })
        );

        await logAudit({
            userId: user.id,
            action: "PDF_EXPORT",
            entity: "CLASS",
            entityId: classId,
            metadata: {
                type,
                targetEntity: classId,
                timestamp: new Date().toISOString(),
            },
        });

        const filename = `class_${type}_${classId}`;

        return createPdfResponse(pdfBuffer, filename);
    } catch (error: any) {
        console.error("[GET /api/teacher/reports/export]", error);

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


