export interface Role {
    id: string;
    name: 'admin' | 'teacher' | 'student';
    permissions: string[];
}

export const roles: Role[] = [
    {
        id: "role-001",
        name: "admin",
        permissions: [
            "viewStudents", "editStudents", "deleteStudents",
            "viewTeachers", "editTeachers", "deleteTeachers",
            "viewClasses", "editClasses", "deleteClasses",
            "viewPeriods", "editPeriods", "deletePeriods",
            "viewRoles", "editRoles"
        ],
    },
    {
        id: "role-002",
        name: "teacher",
        permissions: [
            "viewStudents",
            "viewClasses",
            "viewPeriods", "markAttendance", "addGrades"
        ],
    },
    {
        id: "role-003",
        name: "student",
        permissions: [
            "viewOwnProfile",
            "viewOwnGrades",
            "viewOwnAttendance",
            "viewOwnSchedule"
        ],
    },
];
