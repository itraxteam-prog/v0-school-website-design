export interface Teacher {
    id: string;
    name: string;
    employeeId: string;
    classIds: string[];
    department: string;
}

export const teachers: Teacher[] = [
    {
        id: "tch-001",
        name: "Dr. Ramesh Verma",
        employeeId: "EMP-401",
        classIds: ["cls-001", "cls-002"],
        department: "Science",
    },
    {
        id: "tch-002",
        name: "Ms. Sunita Rao",
        employeeId: "EMP-402",
        classIds: ["cls-003"],
        department: "Mathematics",
    },
    {
        id: "tch-003",
        name: "Mr. Amit Singh",
        employeeId: "EMP-403",
        classIds: ["cls-001"],
        department: "English",
    },
];
