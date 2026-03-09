import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";
import { TargetRole } from "@prisma/client";

export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user.role as TargetRole;

        const announcements = await prisma.announcement.findMany({
            where: {
                OR: [
                    { targetRole: userRole },
                    { targetRole: "ALL" },
                ],
                AND: [
                    {
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } },
                        ]
                    }
                ]
            },
            include: {
                author: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        return NextResponse.json(announcements);
    } catch (error: any) {
        console.error("[GET /api/notifications] Error fetching notifications:", error);
        return NextResponse.json({
            error: "Failed to fetch notifications",
            message: error.message
        }, { status: 500 });
    }
}
