import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "TEACHER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const teacher = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                profile: true,
                taughtClasses: true,
            },
        })

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
        }

        const academic = teacher.profile?.academicHistory as any || {};

        return NextResponse.json({
            fullName: teacher.name,
            email: teacher.email,
            avatarUrl: teacher.image,
            employeeId: teacher.profile?.rollNumber || "N/A",
            status: teacher.status,
            dateOfBirth: teacher.profile?.dateOfBirth,
            gender: teacher.profile?.gender,
            qualification: academic.qualification || "N/A",
            subjects: academic.subjects || "N/A",
            phone: teacher.profile?.phone || "N/A",
            address: teacher.profile?.address || "N/A",
            joiningDate: teacher.profile?.admissionDate,
            classes: teacher.taughtClasses.map(c => c.name).join(", ") || "None assigned",
            initials: teacher.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "T"
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
