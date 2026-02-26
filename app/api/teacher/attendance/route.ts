import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const classId = searchParams.get("classId")
        const date = searchParams.get("date")

        if (!classId || !date) {
            return NextResponse.json({ error: "classId and date are required" }, { status: 400 })
        }

        // Verify teacher owns class
        const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
        if (!cls) {
            return NextResponse.json({ error: "Class not found or access denied" }, { status: 404 })
        }

        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const records = await prisma.attendance.findMany({
            where: { classId, date: { gte: startOfDay, lte: endOfDay } },
        })

        return NextResponse.json({ data: records })
    } catch (error: any) {
        console.error("[GET /api/teacher/attendance]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const parsed = postSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { classId, date, records } = parsed.data

        // Verify teacher owns this class
        const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: session.user.id } })
        if (!cls) {
            return NextResponse.json({ error: "Class not found or access denied" }, { status: 403 })
        }

        const attendanceDate = new Date(date)

        // Upsert attendance records
        const upsertPromises = records.map((rec) =>
            prisma.attendance.upsert({
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
            }).catch(async () => {
                // If upsert fails (no matching id), just create
                return prisma.attendance.create({
                    data: {
                        studentId: rec.studentId,
                        classId,
                        date: attendanceDate,
                        status: rec.status.toUpperCase(),
                        remarks: rec.remarks,
                    },
                })
            })
        )

        await Promise.all(upsertPromises)

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "SAVE_ATTENDANCE",
                entity: "Attendance",
                metadata: { classId, date, count: records.length },
            },
        })

        return NextResponse.json({ success: true, message: "Attendance saved successfully" })
    } catch (error: any) {
        console.error("[POST /api/teacher/attendance]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
