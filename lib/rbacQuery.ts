import { prisma } from "@/prisma/client";

export async function scopedUserQuery(session: any) {
    if (session.user.role === "ADMIN") {
        return prisma.user.findMany();
    }

    if (session.user.role === "TEACHER") {
        return prisma.user.findMany({
            where: {
                role: "STUDENT",
            },
        });
    }

    if (session.user.role === "STUDENT") {
        return prisma.user.findMany({
            where: {
                id: session.user.id,
            },
        });
    }

    return [];
}
