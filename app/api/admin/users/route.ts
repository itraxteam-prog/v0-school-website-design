export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleAuthError } from "@/lib/auth-guard"
import { withTimeout } from "@/lib/server-timeout"
import { rateLimit, getIP } from "@/lib/rate-limit"
import { logAudit } from "@/lib/audit"
import { assertAdmin } from "@/lib/assert-role"
import { z } from "zod"
import { requireServerAuth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        await assertAdmin();

        const users = await withTimeout(
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            8000,
            "GET /api/admin/users"
        );

        return NextResponse.json(users)
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function DELETE(req: NextRequest) {
    const user = await requireServerAuth([Role.ADMIN]);
    try {
        const session = await assertAdmin();

        const ip = getIP(req)
        const { success } = await rateLimit(ip, "mutation")
        if (!success) {
            throw new Error("TOO_MANY_REQUESTS");
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        const schema = z.object({
            id: z.string().uuid()
        }).strict()

        const parsed = schema.safeParse({ id })
        if (!parsed.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: parsed.error.flatten()
            }, { status: 400 })
        }

        await withTimeout((async () => {
            await prisma.user.delete({
                where: { id: parsed.data.id },
            })

            await logAudit({
                userId: session.user.id,
                action: "DELETE_USER",
                entity: "User",
                entityId: parsed.data.id,
                metadata: { deletedBy: session.user.email },
            })
        })(), 8000, "DELETE /api/admin/users");

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return handleAuthError(error);
    }
}


