import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || !user.two_factor_secret) {
            return NextResponse.json({ error: "2FA setup not initiated" }, { status: 400 });
        }

        const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: "base32",
            token: code,
        });

        if (!verified) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        // Generate recovery codes
        const recoveryCodes = Array.from({ length: 12 }, () =>
            Math.random().toString(36).substring(2, 10).toUpperCase()
        );

        await prisma.user.update({
            where: { id: user.id },
            data: {
                two_factor_enabled: true,
                two_factor_backup_codes: JSON.stringify(recoveryCodes)
            }
        });

        await logAudit({
            action: "2FA_ENABLED",
            entity: "USER",
            entityId: user.id,
            userId: user.id,
            metadata: {
                email: user.email,
                timestamp: new Date().toISOString()
            }
        });

        return NextResponse.json({
            success: true,
            data: { recoveryCodes }
        });
    } catch (error) {
        console.error("2FA Enable Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
