import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Some files use auth-options, but auth exports it
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure directory exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save to public/uploads
        const fileName = `${session.user.id}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(uploadDir, fileName);

        await writeFile(path, buffer);
        const imageUrl = `/uploads/${fileName}`;

        // Update user image in database
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        });

        console.info(`[POST /api/user/photo] Successfully uploaded image for user: ${session.user.id}`);

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error("[POST /api/user/photo] Upload error:", error);
        return NextResponse.json({
            error: "Upload failed",
            message: error.message
        }, { status: 500 });
    }
}
