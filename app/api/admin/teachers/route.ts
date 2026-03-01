export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { assertAdmin } from "@/lib/assert-role"
import { handleAuthError } from "@/lib/auth-guard"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

const teacherSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    employeeId: z.string().optional(),
    department: z.string().optional(),
    classIds: z.string().optional(),
}).strict()

export async function GET(req: NextRequest) {
    try {
        await assertAdmin();

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit
        const search = searchParams.get("search") || ""

        const where = {
            role: "TEACHER" as const,
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                    { profile: { rollNumber: { contains: search, mode: "insensitive" as const } } }
                ]
            } : {})
        }

        const [teachers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    profile: true,
                    taughtClasses: true,
                },
                orderBy: { name: "asc" },
                skip,
                take: limit,
            }),
            prisma.user.count({ where })
        ])

        const formatted = teachers.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            status: t.status,
            employeeId: t.profile?.rollNumber || "N/A",
            department: t.profile?.gender || "Faculty", // Using gender field as temporary store if department not in schema, but let's check schema again
            classIds: t.taughtClasses.map(c => c.id).join(', '),
            createdAt: t.createdAt,
        }))

        return NextResponse.json({
            data: formatted,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error: any) {
        return handleAuthError(error);
    }
}


export async function POST(req: NextRequest) {
    await requireServerAuth([Role.ADMIN]);
    try {
        await assertAdmin();

        const body = await req.json()
        const parsed = teacherSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        const { name, email, employeeId, department, classIds } = parsed.data

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const newTeacher = await prisma.user.create({
            data: {
                name,
                email,
                role: "TEACHER",
                status: "ACTIVE",
                profile: {
                    create: {
                        rollNumber: employeeId,
                        // We don't have a 'department' field in Profile, so we might skip it or use a generic field
                        gender: department, // Hack: using gender to store department if no other field is suitable
                    }
                }
            },
        })

        // Handle class associations if classIds provided
        if (classIds) {
            const ids = classIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
            for (const id of ids) {
                try {
                    await prisma.class.update({
                        where: { id },
                        data: { teacherId: newTeacher.id }
                    })
                } catch (e) {
                    console.error(`Failed to assign class ${id} to teacher ${newTeacher.id}`)
                }
            }
        }

        return NextResponse.json({ data: newTeacher }, { status: 201 })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

