import { prisma } from "./lib/prisma";
import { hashPassword } from "./lib/utils/auth-crypto";

async function main() {
    console.log("Starting seed...");
    const hashedPassword = await hashPassword("Password123!");

    // 1. Settings
    await prisma.setting.upsert({
        where: { key: "school_name" },
        update: {},
        create: { key: "school_name", value: "Pioneers High School" }
    });

    await prisma.setting.upsert({
        where: { key: "current_term" },
        update: {},
        create: { key: "current_term", value: "Spring 2026" }
    });

    // 2. Clear existing to avoid conflicts during hardening re-seed
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { notIn: ["admin@school.com"] } } });

    // 3. Admin
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

    // 4. Teachers
    const teachers = [];
    for (let i = 1; i <= 5; i++) {
        const t = await prisma.user.create({
            data: {
                email: `teacher${i}@school.com`,
                name: i === 1 ? "Sarah Jenkins" : `Teacher ${i}`,
                password: hashedPassword,
                role: "TEACHER",
                status: "ACTIVE",
                profile: {
                    create: {
                        rollNumber: `EMP-${1000 + i}`,
                        phone: `+92 300 123456${i}`,
                        address: `${i}th Faculty Lane, Academic Block`
                    }
                }
            }
        });
        teachers.push(t);
    }

    // 5. Classes
    const class1 = await prisma.class.create({
        data: {
            name: "Grade 10-A",
            subject: "Advanced Mathematics",
            teacherId: teachers[0].id
        }
    });

    const class2 = await prisma.class.create({
        data: {
            name: "Grade 11-B",
            subject: "Physics",
            teacherId: teachers[1].id
        }
    });

    // 6. Students (Create 25 for pagination testing)
    const students = [];
    for (let i = 1; i <= 25; i++) {
        const s = await prisma.user.create({
            data: {
                email: `student${i}@school.com`,
                name: i === 1 ? "Ahmed Khan" : `Student ${i}`,
                password: hashedPassword,
                role: "STUDENT",
                status: "ACTIVE",
                classes: { connect: { id: i % 2 === 0 ? class1.id : class2.id } },
                profile: {
                    create: {
                        rollNumber: `2026-${100 + i}`,
                        dateOfBirth: new Date(2010, 0, i),
                        guardianName: `Guardian ${i}`,
                        guardianPhone: `+92 321 987654${i % 10}`,
                        address: `House ${i}, Sector ${String.fromCharCode(65 + (i % 5))}, City`,
                        city: "Lahore",
                        nationality: "Pakistani",
                        admissionDate: new Date(2022, 7, 1)
                    }
                }
            }
        });
        students.push(s);
    }

    // 7. Announcements
    await prisma.announcement.create({
        data: {
            title: "Annual Sports Day 2026",
            content: "We are excited to announce our Annual Sports Day on March 15th.",
            targetRole: "ALL",
            createdBy: admin.id
        }
    });

    // 8. Assignments
    await prisma.assignment.create({
        data: {
            title: "Calculus Homework",
            description: "Complete exercises 1-10 on page 45.",
            dueDate: new Date(Date.now() + 7 * 86400000),
            classId: class1.id
        }
    });

    console.log("Seeding completed successfully", {
        admin: admin.email,
        teachers: teachers.length,
        students: students.length,
        classes: 2,
        settings: 2
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

