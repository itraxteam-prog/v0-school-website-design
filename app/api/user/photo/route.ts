import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Some files use auth-options, but auth exports it
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Update user image in database with the base64 string
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: image }
        });

        console.info(`[POST /api/user/photo] Successfully updated image for user: ${session.user.id}`);

        return NextResponse.json({ url: image });
    } catch (error: any) {
        console.error("[POST /api/user/photo] Update error:", error);
        return NextResponse.json({
            error: "Update failed",
            message: error.message
        }, { status: 500 });
    }
}
