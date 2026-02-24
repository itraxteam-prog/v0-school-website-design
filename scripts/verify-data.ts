
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/utils/auth-crypto";

async function verifyDataIntegrity() {
    console.log("🚀 Starting Data Integrity Verification...");

    const testEmail = "test-check@example.com";
    const hashedPassword = await hashPassword("TestPass123!");

    // 1. Create Student
    console.log("1. Creating test student...");
    const student = await prisma.user.create({
        data: {
            email: testEmail,
            name: "Test Student",
            password: hashedPassword,
            role: "STUDENT",
            status: "ACTIVE",
        }
    });
    console.log(`✅ Student created: ${student.id}`);

    // 2. Edit Student
    console.log("2. Editing student...");
    const updated = await prisma.user.update({
        where: { id: student.id },
        data: { name: "Updated Student" }
    });
    if (updated.name === "Updated Student") {
        console.log("✅ Student edited successfully");
    } else {
        throw new Error("Student edit failed");
    }

    // 3. Create Audit Log (Server-side simulation)
    console.log("3. Creating audit log...");
    const audit = await prisma.auditLog.create({
        data: {
            userId: student.id,
            action: "TEST_ACTION",
            entity: "User",
            entityId: student.id,
            metadata: { step: "verification" }
        }
    });
    console.log(`✅ Audit log created: ${audit.id}`);

    // 4. Delete Student
    console.log("4. Deleting student...");
    await prisma.user.delete({
        where: { id: student.id }
    });
    console.log("✅ Student deleted");

    // 5. Verify Orphaned Related Audit Log
    console.log("5. Checking audit log after user deletion...");
    const orphanedAudit = await prisma.auditLog.findUnique({
        where: { id: audit.id }
    });
    if (orphanedAudit) {
        console.log("✅ Audit log persists after user deletion (as expected for logs)");
    } else {
        console.log("❌ Audit log deleted with user (unexpected if using standard audit pattern)");
    }

    console.log("✨ Data Integrity Verification Complete!");
}

verifyDataIntegrity()
    .catch((e) => {
        console.error("❌ Verification failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
