import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { TargetRole } from "@prisma/client";

export async function GET() {
    try {
        await requireRole("ADMIN");

        const announcements = await prisma.announcement.findMany({
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

export async function POST(req: Request) {
    try {
        const session = await requireRole("ADMIN");
        const body = await req.json();
        const { title, content, targetRole, expiresAt } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                targetRole: (targetRole as TargetRole) || "ALL",
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                createdBy: session.user.id,
            },
        });

        return NextResponse.json(announcement);
    } catch (error) {
        return handleAuthError(error);
    }
}
