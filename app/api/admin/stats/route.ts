import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
import { requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { withTimeout } from "@/lib/server-timeout";
import { logger } from "@/lib/logger";

const getCachedAdminStats = unstable_cache(
    async () => {
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

        return {
            stats: {
                totalStudents,
                totalTeachers,
                totalClasses,
                attendanceToday: attendanceToday > 0 ? `${Math.round((attendanceToday / totalStudents) * 100)}%` : "0%"
            },
            recentLogs
        };
    },
    ['admin-stats'],
    { revalidate: 60, tags: ['stats'] }
);

export async function GET() {
    try {
        await requireRole("ADMIN");

        const data = await withTimeout(
            getCachedAdminStats(),
            8000,
            "GET /api/admin/stats"
        );

        return NextResponse.json(data);
    } catch (error: any) {
        logger.error({
            error: error.message,
            context: "GET /api/admin/stats"
        }, "Stats fetch failed");

        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: error.status || 500 }
        );
    }
}

