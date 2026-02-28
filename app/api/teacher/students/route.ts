export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, handleAuthError } from "@/lib/auth-guard"
import { withTimeout } from "@/lib/server-timeout"

export async function GET(req: NextRequest) {
    try {
        const session = await requireRole("TEACHER");

        const { searchParams } = new URL(req.url)
        const classId = searchParams.get("classId")

        if (!classId) {
            return NextResponse.json({ error: "classId is required" }, { status: 400 })
        }

        const data = await withTimeout((async () => {
            // Verify this teacher owns the class
            const cls = await prisma.class.findFirst({
                where: { id: classId, teacherId: session.user.id },
            })

            if (!cls) {
                throw new Error("FORBIDDEN");
            }

            const students = await prisma.user.findMany({
                where: {
                    role: "STUDENT",
                    classes: { some: { id: classId } },
                },
                select: { id: true, name: true, email: true },
                orderBy: { name: "asc" },
            })

            return students.map((s, index) => ({
                id: s.id,
                name: s.name || s.email || "Unknown",
                rollNo: String(index + 1).padStart(3, "0"),
                classId,
            }))
        })(), 8000, "GET /api/teacher/students");

        return NextResponse.json({ data });
    } catch (error: any) {
        return handleAuthError(error);
    }
}


