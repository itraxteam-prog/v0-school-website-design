import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const studentSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    classId: z.string().optional(),
})

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: {
                classes: { select: { id: true, name: true } }
            },
            orderBy: { name: "asc" },
        })

        const formatted = students.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            classId: s.classes[0]?.id || "Unassigned",
            className: s.classes[0]?.name || "Unassigned",
            status: s.status,
        }))

        return NextResponse.json({ data: formatted })
    } catch (error: any) {
        console.error("[GET /api/admin/students]", error)
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
        const parsed = studentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 })
        }

        const { name, email, classId } = parsed.data

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
                ...(classId && classId !== "Unassigned" && {
                    classes: { connect: { id: classId } }
                })
            },
        })

        return NextResponse.json({ data: newStudent }, { status: 201 })
    } catch (error: any) {
        console.error("[POST /api/admin/students]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
