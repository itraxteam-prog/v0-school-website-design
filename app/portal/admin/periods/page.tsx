import { prisma } from "@/lib/prisma"
import { PeriodsManager } from "@/components/portal/periods-manager"

export default async function AdminPeriodsPage() {
    // Try to fetch from database
    let periods: any[] = []
    let classes: any[] = []

    try {
        // In a real app we would have models for Period and Class
        // For this prototype we will use the baseline mock if DB is empty
        // as we haven't fully implemented the Class/Period schema yet in this session

        // Mock fallback baseline
        classes = [
            { id: "cls-001", name: "Grade 10-A" },
            { id: "cls-002", name: "Grade 9-B" },
            { id: "cls-003", name: "Grade 8-C" },
        ];

        periods = [
            { id: "p-1", name: "Mathematics", classId: "cls-001", startTime: "08:30", endTime: "09:30" },
            { id: "p-2", name: "Physics", classId: "cls-001", startTime: "09:30", endTime: "10:30" },
            { id: "p-3", name: "Chemistry", classId: "cls-001", startTime: "11:00", endTime: "12:00" },
            { id: "p-4", name: "English", classId: "cls-002", startTime: "08:30", endTime: "09:30" },
            { id: "p-5", name: "Biology", classId: "cls-002", startTime: "09:30", endTime: "10:30" },
        ];
    } catch (error) {
        console.error("DB Fetch failed:", error)
    }

    return <PeriodsManager initialPeriods={periods} initialClasses={classes} />
}
