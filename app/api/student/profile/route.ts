export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        const session = await requireRole("STUDENT");

        const student = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                profile: true,
                classes: {
                    select: {
                        id: true,
                        name: true,
                        subject: true
                    }
                }
            }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Format data to match frontend expectations
        const formatted = {
            id: student.id,
            fullName: student.name,
            email: student.email,
            avatarUrl: student.image,
            role: student.role,
            status: student.status,
            createdAt: student.createdAt,

            // Profile fields
            rollNumber: student.profile?.rollNumber,
            dateOfBirth: student.profile?.dateOfBirth,
            gender: student.profile?.gender,
            bloodGroup: student.profile?.bloodGroup,
            nationality: student.profile?.nationality,
            admissionDate: student.profile?.admissionDate,
            address: student.profile?.address,
            city: student.profile?.city,
            postalCode: student.profile?.postalCode,
            phone: student.profile?.phone,

            // Guardian
            guardianName: student.profile?.guardianName,
            guardianPhone: student.profile?.guardianPhone,
            guardianEmail: student.profile?.guardianEmail,
            guardianRelation: student.profile?.guardianRelation,
            guardianOccupation: student.profile?.guardianOccupation,

            // Academic
            academicHistory: student.profile?.academicHistory,
            classes: student.classes,
            subjects: student.classes.map(c => c.subject || c.name),
            currentClass: student.classes[0]?.name || "Unassigned",
            currentSection: "A", // Section not in schema yet, default to A
        };

        return NextResponse.json(formatted);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function PATCH(req: Request) {
    const user = await requireServerAuth([Role.STUDENT]);
    try {
        const session = await requireRole("STUDENT");
        const body = await req.json();

        // Only allow updating certain profile fields
        const { phone, address, city, postalCode } = body;

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                profile: {
                    upsert: {
                        create: { phone, address, city, postalCode },
                        update: { phone, address, city, postalCode }
                    }
                }
            },
            include: { profile: true }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return handleAuthError(error);
    }
}

