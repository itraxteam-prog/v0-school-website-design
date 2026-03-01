export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentAttendancePdf } from "@/lib/pdf/templates/StudentAttendancePdf";
import React from "react";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "STUDENT") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const studentId = session.user.id;

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
                studentName: session.user.name ?? "Student",
                studentEmail: session.user.email ?? "",
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                rows,
                summary: { total, present, absent, late },
            })
        );

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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
