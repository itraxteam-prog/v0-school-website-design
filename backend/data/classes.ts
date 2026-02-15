export interface Class {
    id: string;
    name: string;
    classTeacherId: string;
    roomNo: string;
    studentIds: string[];
}

export const classes: Class[] = [
    {
        id: "cls-001",
        name: "Grade 10-A",
        classTeacherId: "tch-001",
        roomNo: "R-101",
        studentIds: ["std-001", "std-002"],
    },
    {
        id: "cls-002",
        name: "Grade 10-B",
        classTeacherId: "tch-003",
        roomNo: "R-102",
        studentIds: ["std-003", "std-004"],
    },
    {
        id: "cls-003",
        name: "Grade 11-A",
        classTeacherId: "tch-002",
        roomNo: "R-201",
        studentIds: ["std-005"],
    },
];
