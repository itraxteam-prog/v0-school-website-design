import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentGradesPdf } from "@/lib/pdf/templates/StudentGradesPdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";
import { checkExportRateLimit } from "@/lib/pdf/export-rate-limit";
import { createPdfResponse } from "@/lib/pdf/pdf-response";
import { assertNodeRuntime } from "@/lib/runtime-assert";
import { getSchoolLogo } from "@/lib/pdf/pdf-assets";

const SCHOOL_NAME = "The Pioneers High School";

export async function GET() {
    try {
        assertNodeRuntime();
        const user = await exportGuard(["STUDENT"]);
        await checkExportRateLimit(user.id, user.role);

        const studentId = user.id;

        const grades = await prisma.grade.findMany({
            where: { studentId },
            include: { class: { select: { name: true, subject: true } } },
            orderBy: { class: { createdAt: "desc" } },
        });

        const termMapping: Record<string, string> = {
            "september-2025": "September 2025",
            "october-2025": "October 2025",
            "november-2025": "November 2025",
            "mid-term": "Mid-Term Exam",
            "december-2025": "December 2025",
            "january-2026": "January 2026",
            "february-2026": "February 2026",
            "march-2026": "March 2026",
            "final-term": "Final Exam"
        };

        const rows = grades.map((g) => {
            const score = g.marks;
            let grade = "F";
            if (score >= 90) grade = "A+";
            else if (score >= 85) grade = "A";
            else if (score >= 80) grade = "A-";
            else if (score >= 75) grade = "B+";
            else if (score >= 70) grade = "B";
            else if (score >= 65) grade = "B-";
            else if (score >= 60) grade = "C+";
            else if (score >= 55) grade = "C";
            else if (score >= 50) grade = "D";

            return {
                subject: g.class?.subject ?? g.subjectId,
                className: g.class?.name ?? null,
                term: termMapping[g.term] || g.term,
                marks: `${g.marks}/100`,
                grade,
            };
        });

        const logoUrl = await getSchoolLogo();

        const pdfBuffer = await createPdf(
            React.createElement(StudentGradesPdf, {
                studentName: user.name ?? "Student",
                studentEmail: user.email ?? "",
                schoolName: SCHOOL_NAME,
                logoUrl,
                userEmail: user.email ?? "unknown",
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                rows,
            })
        );

        await logAudit({
            userId: user.id,
            action: "PDF_EXPORT",
            entity: "STUDENT",
            entityId: studentId,
            metadata: {
                type: "grades",
                targetEntity: studentId,
                timestamp: new Date().toISOString(),
            },
        });

        const filename = `grades_${studentId}`;

        return createPdfResponse(pdfBuffer, filename);
    } catch (error: any) {
        console.error("[GET /api/student/grades/export]", error);

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


