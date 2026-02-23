import { prisma } from "./lib/prisma";
import { hashPassword } from "./lib/utils/auth-crypto";

async function main() {
    // Bcrypt hashing is async
    const hashedPassword = await hashPassword("Password123!");

    const admin = await prisma.user.upsert({
        where: { email: "admin@school.com" },
        update: { password: hashedPassword },
        create: {
            email: "admin@school.com",
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: "teacher@school.com" },
        update: { password: hashedPassword },
        create: {
            email: "teacher@school.com",
            name: "Teacher User",
            password: hashedPassword,
            role: "TEACHER",
            status: "ACTIVE",
        },
    });

    const student = await prisma.user.upsert({
        where: { email: "student@school.com" },
        update: { password: hashedPassword },
        create: {
            email: "student@school.com",
            name: "Student User",
            password: hashedPassword,
            role: "STUDENT",
            status: "ACTIVE",
        },
    });

    const suspendedStudent = await prisma.user.upsert({
        where: { email: "suspended@school.com" },
        update: { password: hashedPassword },
        create: {
            email: "suspended@school.com",
            name: "Suspended Student",
            password: hashedPassword,
            role: "STUDENT",
            status: "SUSPENDED",
        },
    });

    console.log("Seeding completed successfully", {
        admin: admin.email,
        teacher: teacher.email,
        student: student.email,
        suspended: suspendedStudent.email
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
