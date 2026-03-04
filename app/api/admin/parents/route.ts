export const dynamic = 'force-dynamic';
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/assert-role";
import { handleAuthError } from "@/lib/auth-guard";
import { hashPassword } from "@/lib/utils/auth-crypto";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const parentSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    studentIds: z.array(z.string()).min(1),
}).strict();

export async function GET() {
    try {
        await assertAdmin();

        const parents = await prisma.user.findMany({
            where: { role: "PARENT" },
            include: {
                parent: {
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
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const formatted = parents.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            status: p.status,
            children: p.parent?.children.map(c => ({
                id: c.student.id,
                name: c.student.name,
                class: c.student.classes[0]?.name || "Unassigned",
                rollNumber: c.student.profile?.rollNumber || "Unassigned",
            })) || [],
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return handleAuthError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        await assertAdmin();

        const body = await req.json();
        const validated = parentSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validated.error.flatten()
            }, { status: 400 });
        }

        const { name, email, password, studentIds } = validated.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "PARENT",
                status: "ACTIVE",
                parent: {
                    create: {
                        children: {
                            create: studentIds.map(studentId => ({
                                student: { connect: { id: studentId } }
                            }))
                        }
                    }
                }
            },
            include: {
                parent: true
            }
        });

        // Send welcome email
        const loginUrl = `${process.env.NEXTAUTH_URL}/portal/login`;
        const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b;">Welcome to the Parent Portal</h2>
        <p style="color: #475569;">An account has been created for you. You can now log in to monitor your child's progress.</p>
        <p style="color: #475569;"><strong>Email:</strong> ${email}</p>
        <p style="color: #475569;"><strong>Password:</strong> ${password}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Log In to Portal</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">Please change your password after your first login for security.</p>
      </div>
    `;
        sendEmail(email, "Welcome to the Parent Portal", emailHtml);

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Parent creation error:", error);
        return handleAuthError(error);
    }
}
