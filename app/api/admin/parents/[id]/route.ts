export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/assert-role";
import { handleAuthError } from "@/lib/auth-guard";
import { z } from "zod";
import { hashPassword } from "@/lib/utils/auth-crypto";

const updateParentSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
    studentIds: z.array(z.string()).optional(),
}).strict();



export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await assertAdmin();
        const { id } = params;

        const body = await req.json();
        const validated = updateParentSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const { name, email, password, status, studentIds } = validated.data;

        const data: any = {};
        if (name) data.name = name;
        if (email) data.email = email;
        if (status) data.status = status;
        if (password) {
            data.password = await hashPassword(password);
        }

        if (studentIds) {
            data.parent = {
                update: {
                    children: {
                        deleteMany: {},
                        create: studentIds.map(studentId => ({
                            student: { connect: { id: studentId } }
                        }))
                    }
                }
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await assertAdmin();
        const { id } = params;

        // Delete the user record, cascade will handle the Parent and ParentStudent records if configured correctly in schema.
        // In our schema, we have `onDelete: Cascade` on the `userId` in `Parent` model.
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleAuthError(error);
    }
}
