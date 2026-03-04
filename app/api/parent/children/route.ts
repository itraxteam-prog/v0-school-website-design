export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/server-auth";
import { handleAuthError } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        const session = await requireServerAuth([Role.PARENT]);

        const parent = await prisma.parent.findUnique({
            where: { userId: session.id },
            include: {
                children: {
                    include: {
                        student: {
                            include: {
                                classes: {
                                    select: { id: true, name: true }
                                },
                                profile: {
                                    select: { rollNumber: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!parent) {
            return NextResponse.json({ error: "Parent record not found" }, { status: 404 });
        }

        const children = parent.children.map(c => ({
            id: c.student.id,
            name: c.student.name,
            class: c.student.classes[0]?.name || "Unassigned",
            rollNumber: c.student.profile?.rollNumber || "Unassigned",
        }));

        return NextResponse.json(children);
    } catch (error) {
        return handleAuthError(error);
    }
}
