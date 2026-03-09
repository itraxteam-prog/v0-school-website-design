import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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

        // Upload to Cloudinary to prevent REQUEST_HEADER_TOO_LARGE
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "user_photos",
        });

        const imageUrl = uploadResponse.secure_url;

        // Update user image in database with the Cloudinary URL
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        });

        console.info(`[POST /api/user/photo] Successfully updated image for user: ${session.user.id}`);

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error("[POST /api/user/photo] Update error:", error);
        return NextResponse.json({
            error: "Update failed",
            message: error.message
        }, { status: 500 });
    }
}
