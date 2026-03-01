import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const secret = speakeasy.generateSecret({
            name: `SchoolPortal:${user.email}`,
        });

        // Store the secret temporarily
        await prisma.user.update({
            where: { id: user.id },
            data: { two_factor_secret: secret.base32 }
        });

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "");

        return NextResponse.json({
            success: true,
            data: {
                secret: secret.base32,
                qrCode: qrCodeUrl
            }
        });
    } catch (error) {
        console.error("2FA Setup Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
