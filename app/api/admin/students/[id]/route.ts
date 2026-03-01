export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";

const updateStudentSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    rollNo: z.string().min(1).optional(),
    classId: z.string().optional(),
    dob: z.string().optional(),
    guardianPhone: z.string().optional(),
    address: z.string().optional(),
}).strict()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await requireServerAuth([Role.ADMIN]);
    try {
        await assertAdmin();

        const body = await req.json()
        const parsed = updateStudentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        const { name, email, rollNo, classId, dob, guardianPhone, address } = parsed.data

        const updatedStudent = await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                email,
                profile: {
                    upsert: {
                        create: {
                            rollNumber: rollNo,
                            dateOfBirth: dob ? new Date(dob) : null,
                            guardianPhone: guardianPhone,
                            address: address,
                        },
                        update: {
                            rollNumber: rollNo,
                            dateOfBirth: dob ? new Date(dob) : null,
                            guardianPhone: guardianPhone,
                            address: address,
                        }
                    }
                },
                ...(classId && classId !== "Unassigned" && {
                    classes: {
                        set: [{ id: classId }]
                    }
                })
            }
        })

        return NextResponse.json({ data: updatedStudent })
    } catch (error: any) {
        console.error("[PATCH /api/admin/students/:id]", error)
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

        // Delete profile, attendance/grades first or rely on cascade
        await prisma.profile.deleteMany({ where: { userId: params.id } })
        await prisma.attendance.deleteMany({ where: { studentId: params.id } })
        await prisma.grade.deleteMany({ where: { studentId: params.id } })

        await prisma.user.delete({ where: { id: params.id } })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[DELETE /api/admin/students/:id]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
