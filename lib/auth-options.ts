import { NextAuthOptions } from "next-auth";
export const runtime = "nodejs";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/utils/auth-crypto";
import { loginSchema } from "@/lib/validations/auth";
import { UserStatus, Role } from "@prisma/client";
import { logger } from "@/lib/logger";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/portal/login",
        error: "/portal/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const ip = (req as any)?.headers?.["x-forwarded-for"]?.split(",")?.[0] || "127.0.0.1";

                const { rateLimit } = await import("@/lib/rate-limit");
                const limitResult = rateLimit(ip, "login");

                if (!limitResult.success) {
                    throw new Error("TOO_MANY_REQUESTS");
                }
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const validated = loginSchema.safeParse(credentials);
                if (!validated.success) {
                    throw new Error("Invalid input format");
                }

                const user = await prisma.user.findUnique({
                    where: { email: validated.data.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                if (user.status === UserStatus.SUSPENDED) {
                    throw new Error("ACCOUNT_SUSPENDED");
                }

                const isCorrect = await verifyPassword(validated.data.password, user.password);
                if (!isCorrect) {
                    logger.warn({ email: validated.data.email, ip }, "LOGIN_FAILED_INVALID_CREDENTIALS");
                    throw new Error("Invalid credentials");
                }

                logger.info({ email: user.email, role: user.role, ip }, "LOGIN_SUCCESS");

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // On first login
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.status = user.status;

                if (user.status === "SUSPENDED") {
                    token.suspended = true;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.status = token.status;
            }

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
