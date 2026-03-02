import { prisma } from "@/lib/prisma";
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
        const { name, ...profileData } = data;

        // Update User name
        if (name) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { name }
            });
        }

        // Handle date fields
        const formattedProfile: any = { ...profileData };
        if (profileData.dateOfBirth) formattedProfile.dateOfBirth = new Date(profileData.dateOfBirth);
        if (profileData.admissionDate) formattedProfile.admissionDate = new Date(profileData.admissionDate);

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
        console.error("[POST /api/user/profile]", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
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
