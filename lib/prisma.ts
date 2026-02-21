import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL - Prisma connection required");
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// Ensure the logger still captures errors even with standard config
// @ts-ignore
prisma.$on("error" as any, (e: any) => {
    logger.error(e, "Prisma error");
});

// @ts-ignore
prisma.$on("warn" as any, (e: any) => {
    logger.warn(e, "Prisma warning");
});

