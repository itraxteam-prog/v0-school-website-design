import { prisma } from "@/lib/prisma";
import { handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";
import { TargetRole } from "@prisma/client";

const updateAnnouncementSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    targetRole: z.nativeEnum(TargetRole).optional(),
    expiresAt: z.string().optional().nullable(),
    notifyParents: z.boolean().optional(),
}).strict();

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await assertAdmin();
        const body = await req.json();
        const validated = updateAnnouncementSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const announcement = await prisma.announcement.update({
            where: { id: params.id },
            data: {
                ...validated.data,
                expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : (validated.data.expiresAt === null ? null : undefined),
            },
        });

        return NextResponse.json(announcement);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await assertAdmin();
        const { id } = params;

        await prisma.announcement.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleAuthError(error);
    }
}
