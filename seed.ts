
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@school.com" },
        update: {},
        create: {
            email: "admin@school.com",
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: "teacher@school.com" },
        update: {},
        create: {
            email: "teacher@school.com",
            name: "Teacher User",
            password: hashedPassword,
            role: "TEACHER",
        },
    });

    const student = await prisma.user.upsert({
        where: { email: "student@school.com" },
        update: {},
        create: {
            email: "student@school.com",
            name: "Student User",
            password: hashedPassword,
            role: "STUDENT",
        },
    });

    console.log({ admin, teacher, student });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
