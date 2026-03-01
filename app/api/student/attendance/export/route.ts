import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentAttendancePdf } from "@/lib/pdf/templates/StudentAttendancePdf";
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
        const user = await exportGuard(["STUDENT"]);
        await checkExportRateLimit(user.id, user.role);

        const studentId = user.id;

        const records = await prisma.attendance.findMany({
            where: { studentId },
            include: { class: { select: { name: true } } },
            orderBy: { date: "desc" },
        });

        const rows = records.map((r) => ({
            date: r.date.toISOString().split("T")[0],
            className: r.class?.name ?? null,
            status: r.status,
            remarks: r.remarks,
        }));

        const total = rows.length;
        const present = rows.filter((r) => r.status.toUpperCase() === "PRESENT").length;
        const absent = rows.filter((r) => r.status.toUpperCase() === "ABSENT").length;
        const late = rows.filter((r) => r.status.toUpperCase() === "LATE").length;

        const pdfBuffer = await createPdf(
            React.createElement(StudentAttendancePdf, {
                studentName: user.name ?? "Student",
                studentEmail: user.email ?? "",
                schoolName: SCHOOL_NAME,
                userEmail: user.email ?? "unknown",
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                rows,
                summary: { total, present, absent, late },
            })
        );

        await logAudit({
            userId: user.id,
            action: "PDF_EXPORT",
            entity: "STUDENT",
            entityId: studentId,
            metadata: {
                type: "attendance",
                targetEntity: studentId,
                timestamp: new Date().toISOString(),
            },
        });

        const filename = `attendance_${studentId}`;

        return createPdfResponse(pdfBuffer, filename);
    } catch (error: any) {
        console.error("[GET /api/student/attendance/export]", error);

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


