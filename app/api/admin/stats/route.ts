import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await requireRole("ADMIN");

        const [
            totalStudents,
            totalTeachers,
            totalClasses,
            recentLogs,
            attendanceToday
        ] = await Promise.all([
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "TEACHER" } }),
            prisma.class.count(),
            prisma.auditLog.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true } } }
            }),
            prisma.attendance.count({
                where: {
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            })
        ]);

        return NextResponse.json({
            stats: {
                totalStudents,
                totalTeachers,
                totalClasses,
                attendanceToday: attendanceToday > 0 ? `${Math.round((attendanceToday / totalStudents) * 100)}%` : "0%"
            },
            recentLogs
        });
    } catch (error) {
        return handleAuthError(error);
    }
}
