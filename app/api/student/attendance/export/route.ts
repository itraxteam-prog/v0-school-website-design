export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentAttendancePdf } from "@/lib/pdf/templates/StudentAttendancePdf";
import React from "react";

import { exportGuard } from "@/lib/pdf/export-guard";
import { logAudit } from "@/lib/audit";

const SCHOOL_NAME = "Vibe School Management System";

export async function GET() {
    try {
        const user = await exportGuard(["STUDENT"]);
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

        const filename = `attendance_${studentId}_${Date.now()}.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error: any) {
        console.error("[GET /api/student/attendance/export]", error);
        return NextResponse.json(
            { error: error.message === "Forbidden" ? "Forbidden" : "Unauthorized" },
            { status: error.message === "Forbidden" ? 403 : 401 }
        );
    }
}

