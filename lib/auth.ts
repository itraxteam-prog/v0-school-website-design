import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { AuthOptions } from "next-auth";

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET - required for signing tokens");
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
    throw new Error("Missing NEXTAUTH_URL - required in production");
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (user && user.password && (await bcrypt.compare(credentials.password, user.password))) {
                    return { id: user.id, name: user.name, email: user.email, role: user.role };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: "__Secure-next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
            },
        },
    },
    useSecureCookies: true,
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role!;
            }
            return session;
        },
    },
    pages: { signIn: "/portal/login" },
    debug: process.env.NODE_ENV === "development",
};

