import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"
import { RolesManager } from "@/components/portal/roles-manager"

export default async function RolesPermissionsPage() {
    await requireRole("ADMIN");

    // Fetch real counts from User table
    const [adminCount, teacherCount, studentCount] = await Promise.all([
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.user.count({ where: { role: "TEACHER" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
    ]);

    // Role Definitions (Permissions mapped to system enums)
    const roles = [
        { 
            id: "r-admin", 
            name: "Administrator", 
            description: "Full system access.", 
            permissions: ["viewStudents", "editStudents", "deleteStudents", "viewTeachers", "editTeachers", "deleteTeachers", "viewClasses", "editClasses", "deleteClasses", "viewPeriods", "editPeriods", "deletePeriods", "viewRoles", "editRoles"], 
            userCount: adminCount 
        },
        { 
            id: "r-teacher", 
            name: "Teacher", 
            description: "Standard academic access.", 
            permissions: ["viewStudents", "viewClasses", "viewPeriods", "editPeriods"], 
            userCount: teacherCount 
        },
        { 
            id: "r-student", 
            name: "Student", 
            description: "Self-service portal access.", 
            permissions: ["viewSelf"], 
            userCount: studentCount 
        },
    ];

    return <RolesManager initialRoles={roles} />
}


