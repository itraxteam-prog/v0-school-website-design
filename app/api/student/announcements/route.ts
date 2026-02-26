import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await requireRole("STUDENT");

        const announcements = await prisma.announcement.findMany({
            where: {
                OR: [
                    { targetRole: "STUDENT" },
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
        });

        return NextResponse.json(announcements);
    } catch (error) {
        return handleAuthError(error);
    }
}
