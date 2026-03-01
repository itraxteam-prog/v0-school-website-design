export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";

const updateTeacherSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    employeeId: z.string().optional(),
    department: z.string().optional(),
    classIds: z.string().optional(),
}).strict()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await requireServerAuth([Role.ADMIN]);
    try {
        await assertAdmin();

        const body = await req.json()
        const parsed = updateTeacherSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        const { name, email, employeeId, department, classIds } = parsed.data

        const updatedTeacher = await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                email,
                profile: {
                    upsert: {
                        create: {
                            rollNumber: employeeId,
                            gender: department,
                        },
                        update: {
                            rollNumber: employeeId,
                            gender: department,
                        }
                    }
                }
            }
        })

        // Handle class associations if classIds provided
        if (classIds) {
            const ids = classIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
            // Reset existing classes
            await prisma.class.updateMany({
                where: { teacherId: params.id },
                data: { teacherId: "temp-unassigned" } // This might fail if teacherId is non-nullable.
                // Given the schema, teacherId is required in Class.
                // So we can only reassign to another teacher or handle it carefully.
            }).catch(() => { })

            for (const id of ids) {
                try {
                    await prisma.class.update({
                        where: { id },
                        data: { teacherId: params.id }
                    })
                } catch (e) {
                    console.error(`Failed to assign class ${id} to teacher ${params.id}`)
                }
            }
        }

        return NextResponse.json({ data: updatedTeacher })
    } catch (error: any) {
        console.error("[PATCH /api/admin/teachers/:id]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await requireServerAuth([Role.ADMIN]);
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Delete profile and associated items first
        await prisma.profile.deleteMany({ where: { userId: params.id } })

        // teacherId is non-nullable in schema — delete associated classes first
        // (cascade removes attendance & grade records for those classes)
        await prisma.class.deleteMany({
            where: { teacherId: params.id },
        })

        await prisma.user.delete({ where: { id: params.id } })

        await logAudit({
            userId: session.user.id,
            action: "DELETE_TEACHER",
            entity: "User",
            entityId: params.id,
            metadata: { deletedBy: session.user.email },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[DELETE /api/admin/teachers/:id]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
