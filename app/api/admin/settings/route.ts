import { prisma } from "@/lib/prisma";
import { handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/assert-role";
import { z } from "zod";

const settingSchema = z.object({
    key: z.string().min(1),
    value: z.string(),
}).strict();

const settingsArraySchema = z.array(settingSchema);

export async function GET() {
    try {
        await assertAdmin();
        const settings = await prisma.setting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function POST(req: Request) {
    try {
        await assertAdmin();
        const body = await req.json();

        let validated;
        if (Array.isArray(body)) {
            validated = settingsArraySchema.safeParse(body);
        } else {
            validated = settingSchema.safeParse(body);
        }

        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const data = validated.data;

        if (Array.isArray(data)) {
            const updates = data.map(s =>
                prisma.setting.upsert({
                    where: { key: s.key },
                    update: { value: s.value },
                    create: { key: s.key, value: s.value }
                })
            );
            await Promise.all(updates);
        } else {
            await prisma.setting.upsert({
                where: { key: data.key },
                update: { value: data.value },
                create: { key: data.key, value: data.value }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleAuthError(error);
    }
}
