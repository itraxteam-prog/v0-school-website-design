export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createPdf } from "@/lib/pdf/createPdf";
import { StudentGradesPdf } from "@/lib/pdf/templates/StudentGradesPdf";
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
                studentName: session.user.name ?? "Student",
                studentEmail: session.user.email ?? "",
                generatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
                rows,
            })
        );

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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
