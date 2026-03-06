export const dynamic = 'force-dynamic';
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
    subjects: z.string().optional(),
    classIds: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    qualification: z.string().optional(),
    joiningDate: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    imageUrl: z.string().optional(),
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

        const formatted = teachers.map(t => {
            const academic = t.profile?.academicHistory as any || {};
            return {
                id: t.id,
                name: t.name,
                email: t.email,
                status: t.status,
                image: t.image,
                employeeId: t.profile?.rollNumber || "N/A",
                subjects: academic.subjects || t.profile?.gender || "Faculty", // Fallback to gender if migrating
                classIds: t.taughtClasses.map(c => c.id).join(', '),
                dob: t.profile?.dateOfBirth ? t.profile.dateOfBirth.toISOString().split('T')[0] : "",
                gender: t.profile?.gender || "",
                qualification: academic.qualification || "",
                joiningDate: t.profile?.admissionDate ? t.profile.admissionDate.toISOString().split('T')[0] : "",
                phone: t.profile?.phone || "",
                address: t.profile?.address || "",
                createdAt: t.createdAt,
            }
        })

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

        const {
            name, email, employeeId, subjects, classIds, dob, gender,
            qualification, joiningDate, phone, address, imageUrl
        } = parsed.data

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const newTeacher = await prisma.user.create({
            data: {
                name,
                email,
                image: imageUrl || null,
                role: "TEACHER",
                status: "ACTIVE",
                profile: {
                    create: {
                        rollNumber: employeeId,
                        dateOfBirth: dob ? new Date(dob) : null,
                        gender: gender || null,
                        admissionDate: joiningDate ? new Date(joiningDate) : null, // Using admissionDate for Joining Date
                        phone: phone || null,
                        address: address || null,
                        academicHistory: { subjects, qualification }
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

