export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentTimetablePdf } from "@/lib/pdf/templates/StudentTimetablePdf";
import React from "react";

export async function GET() {
    try {
        const session = await requireRole("STUDENT");

        const studentId = session.user.id;

        const userWithClasses = await prisma.user.findUnique({
            where: { id: studentId },
            include: {
                classes: { select: { id: true } },
            },
        });

        const classIds = userWithClasses?.classes.map((c) => c.id) ?? [];

        const timetableEntries = classIds.length > 0
            ? await prisma.timetable.findMany({
                where: { classId: { in: classIds } },
                include: {
                    class: { select: { name: true, id: true } },
                },
                orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            })
            : [];

        const rows = timetableEntries.map((e) => ({
            dayOfWeek: e.dayOfWeek,
            startTime: e.startTime,
            endTime: e.endTime,
            subjectName: e.subjectName,
            className: e.class?.name ?? null,
            room: e.room ?? null,
        }));

        // Use term/academicYear from first entry if available
        const firstEntry = timetableEntries[0] ?? null;

        const pdfBuffer = await createPdf(
            React.createElement(StudentTimetablePdf, {
                studentName: session.user.name ?? "Student",
                studentEmail: session.user.email ?? "",
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                term: firstEntry?.term ?? null,
                academicYear: firstEntry?.academicYear ?? null,
                rows,
            })
        );

        const filename = `timetable_${studentId}_${Date.now()}.pdf`;

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
