import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: [
            { level: "error", emit: "event" },
            { level: "warn", emit: "event" },
        ],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// @ts-ignore
prisma.$on("error" as any, (e: any) => {
    logger.error(e, "Prisma error");
});

// @ts-ignore
prisma.$on("warn" as any, (e: any) => {
    logger.warn(e, "Prisma warning");
});
