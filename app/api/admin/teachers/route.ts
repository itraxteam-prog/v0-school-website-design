import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const teacherSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
})

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const teachers = await prisma.user.findMany({
            where: { role: "TEACHER" },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
            },
            orderBy: { name: "asc" },
        })

        return NextResponse.json({ data: teachers })
    } catch (error: any) {
        console.error("[GET /api/admin/teachers]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const parsed = teacherSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
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
        console.error("[POST /api/admin/teachers]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
