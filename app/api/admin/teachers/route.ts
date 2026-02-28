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
                    { email: { contains: search, mode: "insensitive" as const } }
                ]
            } : {})
        }

        const [teachers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: { name: "asc" },
                skip,
                take: limit,
            }),
            prisma.user.count({ where })
        ])

        return NextResponse.json({
            data: teachers,
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
    const user = await requireServerAuth([Role.ADMIN]);
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

        const { name, email } = parsed.data

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
            },
        })

        return NextResponse.json({ data: newTeacher }, { status: 201 })
    } catch (error: any) {
        return handleAuthError(error);
    }
}

