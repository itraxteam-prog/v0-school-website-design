import { PrismaClient } from "@prisma/client";
import { validateEnv } from "./env";

// Ensure environment variables are present before initializing Prisma
validateEnv();

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["error"],
    });

if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
