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
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    nationality: z.string().optional(),
    admissionDate: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().optional(),
    guardianRelation: z.string().optional(),
    guardianOccupation: z.string().optional(),
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
            gender: s.profile?.gender || "",
            bloodGroup: s.profile?.bloodGroup || "",
            nationality: s.profile?.nationality || "",
            admissionDate: s.profile?.admissionDate ? s.profile.admissionDate.toISOString().split('T')[0] : "",
            phone: s.profile?.phone || "",
            city: s.profile?.city || "",
            postalCode: s.profile?.postalCode || "",
            guardianName: s.profile?.guardianName || "",
            guardianPhone: s.profile?.guardianPhone || "",
            guardianEmail: s.profile?.guardianEmail || "",
            guardianRelation: s.profile?.guardianRelation || "",
            guardianOccupation: s.profile?.guardianOccupation || "",
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

        const {
            name, email, rollNo, classId, dob, gender, bloodGroup, nationality, admissionDate,
            phone, city, postalCode, guardianName, guardianPhone, guardianEmail,
            guardianRelation, guardianOccupation, address, imageUrl
        } = parsed.data

        // 1. Check if email exists
        const emailExists = await prisma.user.findUnique({ where: { email } })
        if (emailExists) {
            return NextResponse.json({ error: "A user with this email/roll number already exists" }, { status: 400 })
        }

        // 2. Check if Roll Number exists in Profile
        const rollExists = await prisma.profile.findUnique({
            where: { rollNumber: rollNo }
        })
        if (rollExists) {
            return NextResponse.json({ error: `Roll Number "${rollNo}" is already assigned to another student.` }, { status: 400 })
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
                        gender: gender || null,
                        bloodGroup: bloodGroup || null,
                        nationality: nationality || null,
                        admissionDate: admissionDate ? new Date(admissionDate) : null,
                        phone: phone || null,
                        city: city || null,
                        postalCode: postalCode || null,
                        guardianName: guardianName || null,
                        guardianPhone: guardianPhone || null,
                        guardianEmail: guardianEmail || null,
                        guardianRelation: guardianRelation || null,
                        guardianOccupation: guardianOccupation || null,
                        address: address || null,
                    }
                },
                ...(classId && classId !== "Unassigned" && {
                    classes: { connect: { id: classId } }
                })
            },
            include: { profile: true }
        })

        return NextResponse.json({ success: true, data: newStudent }, { status: 201 })
    } catch (error: any) {
        console.error("[STUDENTS_POST_ERROR]", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Duplicate record detected. Please check the roll number." }, { status: 400 });
        }
        return handleAuthError(error);
    }
}

