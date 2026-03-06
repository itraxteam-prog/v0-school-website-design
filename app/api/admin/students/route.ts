export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { assertAdmin } from "@/lib/assert-role"
import { handleAuthError } from "@/lib/auth-guard"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

const studentSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    rollNo: z.string().min(1),
    classId: z.string().optional(),
    dob: z.string().optional(),
    guardianPhone: z.string().optional(),
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
            role: "STUDENT" as const,
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                    { profile: { rollNumber: { contains: search, mode: "insensitive" as const } } }
                ]
            } : {})
        }

        const [students, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    classes: { select: { id: true, name: true } },
                    profile: true
                },
                orderBy: { name: "asc" },
                skip,
                take: limit,
            }),
            prisma.user.count({ where })
        ])

        const formatted = students.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            image: s.image,
            rollNo: s.profile?.rollNumber || "Unassigned",
            classId: s.classes[0]?.id || "Unassigned",
            className: s.classes[0]?.name || "Unassigned",
            dob: s.profile?.dateOfBirth ? s.profile.dateOfBirth.toISOString().split('T')[0] : "",
            guardianPhone: s.profile?.guardianPhone || "",
            address: s.profile?.address || "",
            status: s.status,
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
    try {
        const session = await assertAdmin();

        const body = await req.json()
        const parsed = studentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        const { name, email, rollNo, classId, dob, guardianPhone, address, imageUrl } = parsed.data

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const newStudent = await prisma.user.create({
            data: {
                name,
                email,
                role: "STUDENT",
                status: "ACTIVE",
                image: imageUrl || null,
                profile: {
                    create: {
                        rollNumber: rollNo,
                        dateOfBirth: dob ? new Date(dob) : null,
                        guardianPhone: guardianPhone,
                        address: address,
                    }
                },
                ...(classId && classId !== "Unassigned" && {
                    classes: { connect: { id: classId } }
                })
            },
        })

        return NextResponse.json({ data: newStudent }, { status: 201 })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

