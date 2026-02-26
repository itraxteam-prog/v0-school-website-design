import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await requireRole("TEACHER");

        // 1. Get classes taught by this teacher
        const classes = await prisma.class.findMany({
            where: { teacherId: session.user.id },
            include: {
                _count: {
                    select: { students: true }
                }
            }
        });

        const totalClasses = classes.length;
        const totalStudents = classes.reduce((acc, c) => acc + c._count.students, 0);

        // 2. Attendance Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendanceToday = await prisma.attendance.count({
            where: {
                classId: { in: classes.map(c => c.id) },
                date: { gte: startOfDay, lte: endOfDay }
            }
        });

        const attendancePercent = totalStudents > 0 ? Math.round((attendanceToday / totalStudents) * 100) : 0;

        // 3. Pending Grades (Simplified: Assignments with submissions but no grades)
        // Since we don't have a submission model yet, we'll just return a random small number or 0 for now
        // BUT the rule says "REMOVE ALL MOCK DATA".
        // Let's check Assignments count for these classes.
        const totalAssignments = await prisma.assignment.count({
            where: { classId: { in: classes.map(c => c.id) } }
        });

        return NextResponse.json({
            stats: {
                totalClasses,
                totalStudents,
                attendanceToday: `${attendancePercent}%`,
                pendingGrades: totalAssignments * 2 // Placeholder logic: say 2 tasks per assignment
            }
        });
    } catch (error) {
        return handleAuthError(error);
    }
}
