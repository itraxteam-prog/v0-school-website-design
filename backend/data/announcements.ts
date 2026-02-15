export interface Announcement {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    audience: ("student" | "teacher" | "all")[];
}

export const announcements: Announcement[] = [
    {
        id: "ann-001",
        title: "School Reopening Notice",
        message: "The school will reopen on Monday, August 21st, after the summer break.",
        createdAt: "2023-08-15T10:00:00Z",
        audience: ["all"],
    },
    {
        id: "ann-002",
        title: "Annual Sports Day",
        message: "Annual Sports Day is scheduled for next Friday. Please register by Wednesday.",
        createdAt: "2023-09-01T09:30:00Z",
        audience: ["student", "teacher"],
    },
    {
        id: "ann-003",
        title: "Teacher Training Session",
        message: "A mandatory training session for all subject teachers will be held this Saturday.",
        createdAt: "2023-09-05T14:00:00Z",
        audience: ["teacher"],
    },
    {
        id: "ann-004",
        title: "Exam Schedule Update",
        message: "The mid-term exam schedule has been updated. Please check the portal for details.",
        createdAt: "2023-10-10T11:00:00Z",
        audience: ["student"],
    },
    {
        id: "ann-005",
        title: "Parent-Teacher Meeting",
        message: "The second term parent-teacher meeting will be held on October 25th.",
        createdAt: "2023-10-15T08:30:00Z",
        audience: ["all"],
    },
];
