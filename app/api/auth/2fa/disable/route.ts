import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

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

        await prisma.user.update({
            where: { id: user.id },
            data: {
                two_factor_enabled: false,
                two_factor_secret: null,
                two_factor_backup_codes: null
            }
        });

        await logAudit({
            action: "2FA_DISABLED",
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
            message: "2FA disabled successfully"
        });
    } catch (error) {
        console.error("2FA Disable Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
