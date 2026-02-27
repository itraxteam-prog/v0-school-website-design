import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, handleAuthError } from "@/lib/auth-guard"
import { withTimeout } from "@/lib/server-timeout"
import { z } from "zod"

const attendanceRecordSchema = z.object({
    studentId: z.string(),
    status: z.enum(["present", "absent", "late", "excused"]),
    remarks: z.string().optional().default(""),
})

const postSchema = z.object({
    classId: z.string(),
    date: z.string(), // ISO date string
    records: z.array(attendanceRecordSchema),
})

export async function GET(req: NextRequest) {
    try {
        const session = await requireRole("TEACHER");

        const { searchParams } = new URL(req.url)
        const classId = searchParams.get("classId")
        const date = searchParams.get("date")

        if (!classId || !date) {
            return NextResponse.json({ error: "classId and date are required" }, { status: 400 })
        }

        const data = await withTimeout((async () => {
            // Verify teacher owns class
            const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
            if (!cls) {
                throw new Error("FORBIDDEN");
            }

            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)

            return prisma.attendance.findMany({
                where: { classId, date: { gte: startOfDay, lte: endOfDay } },
            })
        })(), 8000, "GET /api/teacher/attendance");

        return NextResponse.json({ data })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await requireRole("TEACHER");

        const body = await req.json()
        const parsed = postSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { classId, date, records } = parsed.data

        await withTimeout((async () => {
            // Verify teacher owns this class
            const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
            if (!cls) {
                throw new Error("FORBIDDEN");
            }

            const attendanceDate = new Date(date)

            // Efficient upsert using transaction + deleteMany/createMany or multiple upserts
            // Since we don't have a reliable upsertMany, we'll use sequential within transaction 
            // but we wrap the whole thing to ensure data integrity
            await prisma.$transaction(async (tx) => {
                for (const rec of records) {
                    await tx.attendance.upsert({
                        where: {
                            studentId_classId_date: {
                                studentId: rec.studentId,
                                classId: classId,
                                date: attendanceDate,
                            }
                        },
                        update: {
                            status: rec.status.toUpperCase(),
                            remarks: rec.remarks,
                        },
                        create: {
                            studentId: rec.studentId,
                            classId,
                            date: attendanceDate,
                            status: rec.status.toUpperCase(),
                            remarks: rec.remarks,
                        },
                    })
                }

                await tx.auditLog.create({
                    data: {
                        userId: session.user.id,
                        action: "SAVE_ATTENDANCE",
                        entity: "Attendance",
                        metadata: { classId, date, count: records.length },
                    },
                })
            })
        })(), 8000, "POST /api/teacher/attendance");

        return NextResponse.json({ success: true, message: "Attendance saved successfully" })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

