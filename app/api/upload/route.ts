import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { assertAdmin } from "@/lib/assert-role";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        // Simple auth check for students admin
        await assertAdmin();

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

        try {
            const uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: "school-website",
            });

            return NextResponse.json({
                url: uploadResult.secure_url
            });
        } catch (cloudinaryError: any) {
            console.error("Cloudinary Error:", cloudinaryError);
            return NextResponse.json({
                error: "Image upload failed",
                details: cloudinaryError.message
            }, { status: 500 });
        }
    } catch (error: any) {
        if (error.status === 401 || error.status === 403) {
            return NextResponse.json({ error: "Unauthorized" }, { status: error.status });
        }
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}
