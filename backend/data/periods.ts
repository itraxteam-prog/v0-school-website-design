export interface Period {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    classId: string;
}

export const periods: Period[] = [
    {
        id: "prd-001",
        name: "Mathematics",
        startTime: "08:00 AM",
        endTime: "08:45 AM",
        classId: "cls-001",
    },
    {
        id: "prd-002",
        name: "Physics",
        startTime: "08:45 AM",
        endTime: "09:30 AM",
        classId: "cls-001",
    },
    {
        id: "prd-003",
        name: "English",
        startTime: "09:30 AM",
        endTime: "10:15 AM",
        classId: "cls-001",
    },
    {
        id: "prd-004",
        name: "Chemistry",
        startTime: "08:00 AM",
        endTime: "08:45 AM",
        classId: "cls-002",
    },
    {
        id: "prd-005",
        name: "Biology",
        startTime: "08:45 AM",
        endTime: "09:30 AM",
        classId: "cls-003",
    },
];
