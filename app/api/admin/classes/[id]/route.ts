export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

const updateClassSchema = z.object({
    name: z.string().min(2).optional(),
    teacherId: z.string().optional(),
    subject: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await requireServerAuth([Role.ADMIN]);
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const parsed = updateClassSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { name, teacherId, subject } = parsed.data

        // If updating teacher, verify they exist
        let finalTeacherId = teacherId;
        if (teacherId) {
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
                return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
            }
            finalTeacherId = teacher.id;
        }

        const updated = await prisma.class.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(finalTeacherId && { teacherId: finalTeacherId }),
                ...(subject !== undefined && { subject }),
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
                action: "UPDATE_CLASS",
                entity: "Class",
                entityId: updated.id,
                metadata: { name, teacherId },
            },
        })

        return NextResponse.json({
            data: {
                id: updated.id,
                name: updated.name,
                subject: updated.subject,
                teacher: updated.teacher?.name || updated.teacher?.email || "Unassigned",
                teacherId: updated.teacherId,
                studentCount: updated._count.students,
            },
        })
    } catch (error: any) {
        console.error("[PATCH /api/admin/classes/:id]", error)
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Class not found" }, { status: 404 })
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await requireServerAuth([Role.ADMIN]);
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Delete related records first (cascade not set on all)
        await prisma.attendance.deleteMany({ where: { classId: params.id } })
        await prisma.grade.deleteMany({ where: { classId: params.id } })

        await prisma.class.delete({ where: { id: params.id } })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "DELETE_CLASS",
                entity: "Class",
                entityId: params.id,
            },
        })

        return NextResponse.json({ success: true, message: "Class deleted successfully" })
    } catch (error: any) {
        console.error("[DELETE /api/admin/classes/:id]", error)
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Class not found" }, { status: 404 })
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
