import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "TEACHER" | "STUDENT";
            status: "ACTIVE" | "SUSPENDED";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "ADMIN" | "TEACHER" | "STUDENT";
        status: "ACTIVE" | "SUSPENDED";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "ADMIN" | "TEACHER" | "STUDENT";
        status: "ACTIVE" | "SUSPENDED";
        suspended?: boolean;
    }
}
