import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils/auth-crypto";
import { signupSchema } from "@/lib/validations/auth";
import { requireRole, handleAuthError } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        await requireRole("ADMIN");
        const body = await req.json();
        const validated = signupSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: "Invalid input format", details: validated.error.format() },
                { status: 400 }
            );
        }

        const { email, password, name, role } = validated.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                name,
                role,
                status: "ACTIVE",
            },
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error && ["UNAUTHORIZED", "FORBIDDEN", "SUSPENDED"].includes(error.message)) {
            return handleAuthError(error);
        }
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
