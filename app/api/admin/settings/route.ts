import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await requireRole("ADMIN");
        const settings = await prisma.setting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function POST(req: Request) {
    try {
        await requireRole("ADMIN");
        const body = await req.json();
        
        // Body should be an array of {key, value} or a single object
        if (Array.isArray(body)) {
            const updates = body.map(s => 
                prisma.setting.upsert({
                    where: { key: s.key },
                    update: { value: s.value },
                    create: { key: s.key, value: s.value }
                })
            );
            await Promise.all(updates);
        } else if (body.key && body.value) {
            await prisma.setting.upsert({
                where: { key: body.key },
                update: { value: body.value },
                create: { key: body.key, value: body.value }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleAuthError(error);
    }
}
