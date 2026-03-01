import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/utils/auth-crypto";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Missing passwords" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || !user.password) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isCorrect = await verifyPassword(currentPassword, user.password);
        if (!isCorrect) {
            return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ message: "New password must be at least 8 characters long" }, { status: 400 });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedNewPassword }
        });

        await logAudit({
            action: "PASSWORD_CHANGE",
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
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Change Password API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
