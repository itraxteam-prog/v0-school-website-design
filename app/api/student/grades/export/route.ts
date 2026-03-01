export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentGradesPdf } from "@/lib/pdf/templates/StudentGradesPdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";

const SCHOOL_NAME = "Vibe School Management System";

export async function GET() {
    try {
        const user = await exportGuard(["STUDENT"]);
        const studentId = user.id;

        const grades = await prisma.grade.findMany({
            where: { studentId },
            include: { class: { select: { name: true, subject: true } } },
            orderBy: { class: { createdAt: "desc" } },
        });

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
                term: g.term,
                marks: `${g.marks}/100`,
                grade,
            };
        });

        const pdfBuffer = await createPdf(
            React.createElement(StudentGradesPdf, {
                studentName: user.name ?? "Student",
                studentEmail: user.email ?? "",
                schoolName: SCHOOL_NAME,
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

        const filename = `grades_${studentId}_${Date.now()}.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error: any) {
        console.error("[GET /api/student/grades/export]", error);
        return NextResponse.json(
            { error: error.message === "Forbidden" ? "Forbidden" : "Unauthorized" },
            { status: error.message === "Forbidden" ? 403 : 401 }
        );
    }
}

