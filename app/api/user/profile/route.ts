import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { name, email, status, ...rest } = data;

        // Update User fields
        const userData: any = {};
        if (name) userData.name = name;
        if (email) userData.email = email;
        if (status) userData.status = status;

        if (Object.keys(userData).length > 0) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: userData
            });
        }

        // Filter valid profile fields from Prisma schema
        const profileFields = [
            'rollNumber', 'dateOfBirth', 'gender', 'bloodGroup', 'nationality',
            'admissionDate', 'address', 'city', 'postalCode', 'phone',
            'guardianName', 'guardianPhone', 'guardianEmail', 'guardianRelation', 'guardianOccupation',
        ];

        const formattedProfile: any = {};

        // Loop through fields to ensure type safety and valid values
        profileFields.forEach(field => {
            if (rest[field] !== undefined) {
                // Special handling for dates
                if (field === 'dateOfBirth' || field === 'admissionDate') {
                    if (rest[field]) {
                        const date = new Date(rest[field]);
                        if (!isNaN(date.getTime())) {
                            formattedProfile[field] = date;
                        }
                    } else {
                        formattedProfile[field] = null;
                    }
                } else {
                    formattedProfile[field] = rest[field];
                }
            }
        });

        // Handle academicHistory JSON specifically for qualifications, subjects, etc.
        if (rest.qualifications || rest.subjects || rest.classes || rest.designation || rest.academicHistory) {
            const currentProfile = await prisma.profile.findUnique({
                where: { userId: session.user.id }
            });

            let history = (currentProfile?.academicHistory as any) || {};
            if (typeof history !== 'object') history = {};

            formattedProfile.academicHistory = {
                ...history,
                qualifications: rest.qualifications || history.qualifications,
                subjects: rest.subjects || history.subjects,
                classes: rest.classes || history.classes,
                designation: rest.designation || history.designation,
                ...(typeof rest.academicHistory === 'object' ? rest.academicHistory : {})
            };
        }

        // Update or Create Profile
        await prisma.profile.upsert({
            where: { userId: session.user.id },
            create: {
                ...formattedProfile,
                userId: session.user.id
            },
            update: formattedProfile
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[POST /api/user/profile] Error updating profile:", error);
        return NextResponse.json({
            error: "Failed to update profile",
            message: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { profile: true }
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("[GET /api/user/profile]", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
