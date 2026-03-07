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

import speakeasy from "speakeasy";

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
        signIn: "/portal/login",
        error: "/portal/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                code: { label: "Code", type: "text" },
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        password: true,
                        name: true,
                        image: true,
                        role: true,
                        status: true,
                        two_factor_enabled: true,
                        two_factor_secret: true
                    }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                if (user.status === UserStatus.SUSPENDED) {
                    throw new Error("ACCOUNT_SUSPENDED");
                }

                const isCorrect = await verifyPassword(credentials.password, user.password);
                if (!isCorrect) {
                    // Log security event for failed password
                    await logAudit({
                        action: "LOGIN_FAILED",
                        entity: "USER",
                        entityId: user.id,
                        userId: user.id,
                        metadata: {
                            email: user.email,
                            ip,
                            reason: "INVALID_PASSWORD"
                        }
                    });
                    throw new Error("Invalid credentials");
                }

                // If 2FA is enabled, verify the code
                if (user.two_factor_enabled) {
                    if (!credentials.code) {
                        throw new Error("2FA_REQUIRED");
                    }

                    if (!user.two_factor_secret) {
                        throw new Error("2FA_MISCONFIGURED");
                    }

                    const verified = speakeasy.totp.verify({
                        secret: user.two_factor_secret!,
                        encoding: "base32",
                        token: credentials.code,
                    });

                    if (!verified) {
                        throw new Error("INVALID_2FA_CODE");
                    }
                }

                logger.info({ email: user.email, role: user.role, ip }, "LOGIN_SUCCESS");

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
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
        async jwt({ token, user, trigger, session }) {
            // Preservation logic for user role across JWT updates
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
                token.status = user.status;
                token.accountStatus = user.status;
                token.name = user.name;
                token.picture = user.image;
            }

            if (trigger === "update") {
                if (session?.name) token.name = session.name;
                if (session?.image) token.picture = session.image;
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
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
