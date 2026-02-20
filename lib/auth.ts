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
    session: { strategy: "database" },
    callbacks: {
        async session({ session, user }: any) {
            if (session.user && user) {
                session.user.id = user.id;
                session.user.role = user.role;
            }
            return session;
        },
    },
    pages: { signIn: "/auth/login" },
    debug: false,
};
