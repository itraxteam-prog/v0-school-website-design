import { RolesManager } from "@/components/portal/roles-manager"

export default async function RolesPermissionsPage() {
    // Mock Role Data Baseline for Prototype
    const roles = [
        { id: "r-1", name: "Administrator", description: "Full system access.", permissions: ["viewStudents", "editStudents", "deleteStudents", "viewTeachers", "editTeachers", "deleteTeachers", "viewClasses", "editClasses", "deleteClasses", "viewPeriods", "editPeriods", "deletePeriods", "viewRoles", "editRoles"], userCount: 5 },
        { id: "r-2", name: "Teacher", description: "Standard academic access.", permissions: ["viewStudents", "viewClasses", "viewPeriods", "editPeriods"], userCount: 45 },
        { id: "r-3", name: "Librarian", description: "Media center management.", permissions: ["viewStudents", "viewTeachers"], userCount: 12 },
    ];

    return <RolesManager initialRoles={roles} />
}

