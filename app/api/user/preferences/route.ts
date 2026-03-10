import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { academicHistory: true }
        });

        // Return the whole history so the client can pick the specific portal-scoped key
        return NextResponse.json(profile?.academicHistory || {});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { academicHistory: true }
        });

        const history = (profile?.academicHistory as any) || {};

        await prisma.profile.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                academicHistory: { ...history, ...body }
            },
            update: {
                academicHistory: { ...history, ...body }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
