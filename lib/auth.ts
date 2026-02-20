import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import type { AuthOptions } from "next-auth";

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
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: { signIn: "/auth/login" },
    debug: false,
};
