// File: app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import { SessionStrategy } from "next-auth/core/types";

// Auth configuration
const options: AuthOptions = {
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
                if (user && (await bcrypt.compare(credentials.password, user.password))) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                }
                return null;
            },
        }),
    ],
    session: { strategy: "database" as SessionStrategy },
    callbacks: {
        async session({ session, user }) {
            // Ensure session.user exists
            if (session.user && user) {
                session.user.id = user.id;
                session.user.role = user.role;
            }
            return session;
        },
    },
    pages: { signIn: "/auth/login" },
    debug: false, // toggle true for debugging during dev
};

// Export only GET and POST for Next.js 14 App Router
const handler = NextAuth(options);
export { handler as GET, handler as POST };
