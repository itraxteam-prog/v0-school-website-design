import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: [
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
        ],
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Always cache in globalThis for serverless reuse across invocations if global survives
globalForPrisma.prisma = prisma;

// Ensure the logger captures errors
// @ts-ignore
prisma.$on("error", (e: any) => {
    logger.error({ err: e }, "Prisma error");
});

// @ts-ignore
prisma.$on("warn", (e: any) => {
    logger.warn({ warn: e }, "Prisma warning");
});

