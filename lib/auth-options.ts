import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/utils/auth-crypto";
import { loginSchema } from "@/lib/validations/auth";
import { UserStatus, Role } from "@prisma/client";
import { logger } from "@/lib/logger";


import { logAudit } from "@/lib/audit";

const isProd = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // @ts-ignore - trustHost is required for some serverless environments
    trustHost: true,
    cookies: {
        sessionToken: {
            name: isProd ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: isProd,
            },
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // Default 24 hours
        updateAge: 60 * 60, // 1 hour
    },
    pages: {
        signIn: "/login",
        error: "/login",
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
                const limitResult = await rateLimit(ip, "login");

                if (!limitResult.success) {
                    // Task 3: Log security event on rate limit
                    await logAudit({
                        action: "LOGIN_RATE_LIMITED",
                        entity: "USER",
                        metadata: {
                            email: credentials?.email,
                            ip,
                            timestamp: new Date().toISOString()
                        }
                    });
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
                    accountStatus: user.status,
                    status: user.status,
                };
            },
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) {
                // If it's just the home page, redirect to /portal
                if (url === baseUrl || url === `${baseUrl}/`) {
                    return `${baseUrl}/portal`
                }
                return url
            }
            return `${baseUrl}/portal`
        },
        async jwt({ token, user }) {
            // Preservation logic for user role across JWT updates
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
                token.status = user.status;
                token.accountStatus = user.status;
            }

            // Task 4: Invalidate ADMIN sessions after 8 hours
            if (token.role === "ADMIN" && token.iat) {
                const now = Math.floor(Date.now() / 1000);
                const eightHours = 8 * 60 * 60;
                if (now - (token.iat as number) > eightHours) {
                    return {
                        ...token,
                        id: "",
                        role: "STUDENT",
                        accountStatus: "SUSPENDED",
                        status: "SUSPENDED",
                    } as JWT;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
                session.user.email = token.email as string;
                session.user.status = token.status as UserStatus;
                session.user.accountStatus = token.accountStatus as UserStatus;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
