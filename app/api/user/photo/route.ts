import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

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

        // Save to public/uploads
        const fileName = `${session.user.id}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(process.cwd(), "public", "uploads", fileName);

        await writeFile(path, buffer);
        const imageUrl = `/uploads/${fileName}`;

        // Update user image
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        });

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error("[POST /api/user/photo]", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
