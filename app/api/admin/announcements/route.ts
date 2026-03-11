export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { TargetRole } from "@prisma/client";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sendAnnouncementEmail } from "@/lib/email";

import { logger } from "@/lib/logger";

const announcementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    targetRole: z.nativeEnum(TargetRole).optional().default(TargetRole.ALL),
    expiresAt: z.string().optional().nullable(),
}).strict();

export async function GET() {
    try {
        await assertAdmin();

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
        const session = await assertAdmin();
        const ip = getIP(req);

        // Rate limiting for announcement creation
        const limitResult = await rateLimit(ip, "announcement-create");
        if (!limitResult.success) {
            throw new Error("TOO_MANY_REQUESTS");
        }

        const body = await req.json();
        const validated = announcementSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const { title, content, targetRole, expiresAt } = validated.data;

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                targetRole: targetRole || "ALL",
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                createdBy: session.user.id,
            },
        });

        // Async Email Notification
        (async () => {
            try {
                // RACE CONDITION CHECK: Verify announcement still exists before sending
                const check = await prisma.announcement.findUnique({
                    where: { id: announcement.id }
                });

                if (!check) {
                    logger.warn({ announcementId: announcement.id }, "Announcement was deleted before email processing.");
                    return;
                }

                const users = await prisma.user.findMany({
                    where: {
                        status: "ACTIVE",
                        ...(targetRole !== "ALL" ? { role: targetRole as any } : {})
                    },
                    select: { email: true }
                });

                const emails = users.map(u => u.email).filter(Boolean) as string[];


                const finalEmails = Array.from(new Set(emails));

                if (finalEmails.length > 0) {
                    logger.info({ announcementId: announcement.id, recipientCount: finalEmails.length }, "Sending announcement emails.");
                    sendAnnouncementEmail(finalEmails, title, content);
                } else {
                    logger.info({ targetRole }, "No active users found for role; skipping emails.");
                }
            } catch (err) {
                logger.error({ err, announcementId: announcement.id }, "Failed to trigger announcement emails.");
            }
        })();

        return NextResponse.json(announcement);
    } catch (error) {
        return handleAuthError(error);
    }
}

