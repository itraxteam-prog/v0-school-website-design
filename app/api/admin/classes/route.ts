import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createClassSchema = z.object({
    name: z.string().min(2),
    teacherId: z.string().min(1),
    roomNo: z.string().optional().default(""),
    subject: z.string().optional().default(""),
})

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const classes = await prisma.class.findMany({
            include: {
                teacher: { select: { id: true, name: true, email: true } },
                _count: { select: { students: true } },
            },
            orderBy: { createdAt: "desc" },
        })

        const formatted = classes.map((c) => ({
            id: c.id,
            name: c.name,
            subject: c.subject,
            teacher: c.teacher?.name || c.teacher?.email || "Unassigned",
            teacherId: c.teacherId,
            room: "",
            studentCount: c._count.students,
            createdAt: c.createdAt,
        }))

        return NextResponse.json({ data: formatted })
    } catch (error: any) {
        console.error("[GET /api/admin/classes]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const parsed = createClassSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { name, teacherId, subject } = parsed.data

        // Verify the teacher exists and is a TEACHER
        const teacher = await prisma.user.findFirst({ where: { id: teacherId, role: "TEACHER" } })
        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
        }

        const newClass = await prisma.class.create({
            data: { name, teacherId, subject },
            include: {
                teacher: { select: { name: true, email: true } },
                _count: { select: { students: true } },
            },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE_CLASS",
                entity: "Class",
                entityId: newClass.id,
                metadata: { name, teacherId },
            },
        })

        return NextResponse.json({
            data: {
                id: newClass.id,
                name: newClass.name,
                subject: newClass.subject,
                teacher: newClass.teacher?.name || newClass.teacher?.email || "Unassigned",
                teacherId: newClass.teacherId,
                studentCount: newClass._count.students,
            },
        }, { status: 201 })
    } catch (error: any) {
        console.error("[POST /api/admin/classes]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
