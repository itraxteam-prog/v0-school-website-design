export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        await requireAuth();
        const settings = await prisma.setting.findMany();

        const mappedSettings: Record<string, any> = {};
        settings.forEach(s => {
            if (s.key.includes('.')) {
                const [parent, child] = s.key.split('.');
                if (!mappedSettings[parent]) mappedSettings[parent] = {};
                if (s.value === 'true' || s.value === 'false') {
                    mappedSettings[parent][child] = s.value === 'true';
                } else if (!isNaN(Number(s.value)) && s.key !== 'contactNumber') {
                    mappedSettings[parent][child] = Number(s.value);
                } else {
                    mappedSettings[parent][child] = s.value;
                }
            } else {
                if (s.value === 'true' || s.value === 'false') {
                    mappedSettings[s.key] = s.value === 'true';
                } else if (!isNaN(Number(s.value)) && s.key !== 'schoolCode' && s.key !== 'contactNumber') {
                    mappedSettings[s.key] = Number(s.value);
                } else {
                    mappedSettings[s.key] = s.value;
                }
            }
        });

        return NextResponse.json(mappedSettings);
    } catch (e) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
