export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { assertAdmin } from "@/lib/assert-role"
import { handleAuthError } from "@/lib/auth-guard"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

const createClassSchema = z.object({
    name: z.string().min(2),
    teacherId: z.string().min(1),
    roomNo: z.string().optional().default(""),
    subject: z.string().optional().default(""),
}).strict()

export async function GET() {
    try {
        await assertAdmin();

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
        return handleAuthError(error);
    }
}

export async function POST(req: NextRequest) {
    const user = await requireServerAuth([Role.ADMIN]);
    try {
        const session = await assertAdmin();

        const body = await req.json()
        const parsed = createClassSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        const { name, teacherId, subject } = parsed.data

        // Verify the teacher exists
        // Try looking up by ID, then by employee ID (rollNumber), then by name
        let teacher = await prisma.user.findFirst({
            where: {
                role: "TEACHER",
                OR: [
                    { id: teacherId.length === 36 ? teacherId : undefined },
                    { profile: { rollNumber: teacherId } },
                    { name: { contains: teacherId, mode: 'insensitive' } }
                ]
            }
        })

        if (!teacher) {
            // Fallback: search any teacher if no exact match
            teacher = await prisma.user.findFirst({ where: { role: "TEACHER" } })
        }

        if (!teacher) {
            return NextResponse.json({ error: "No teacher found to assign to this class" }, { status: 404 })
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                teacherId: teacher.id,
                subject: subject || ""
            },
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
                metadata: { name, teacherId: teacher.id },
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
        console.error("POST /api/admin/classes error:", error)
        return handleAuthError(error);
    }
}

