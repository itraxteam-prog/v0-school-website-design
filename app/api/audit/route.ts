import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action, entity, entityId, metadata } = body;

        if (!action || !entity) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await logAudit({
            userId: session.user.id,
            action,
            entity,
            entityId,
            metadata: {
                ...metadata,
                clientIp: req.ip || req.headers.get("x-forwarded-for"),
                userAgent: req.headers.get("user-agent"),
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[API/AUDIT] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
