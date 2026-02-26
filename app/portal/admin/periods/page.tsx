import { prisma } from "@/lib/prisma"
import { PeriodsManager } from "@/components/portal/periods-manager"

export default async function AdminPeriodsPage() {
    let periods: any[] = []
    let classes: any[] = []
    let teachers: any[] = []

    try {
        classes = await prisma.class.findMany({
            select: { id: true, name: true }
        });

        teachers = await prisma.user.findMany({
            where: { role: "TEACHER" },
            select: { id: true, name: true }
        });

        periods = await prisma.timetable.findMany({
            include: {
                class: { select: { name: true } },
                teacher: { select: { name: true } }
            },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" }
            ]
        });
    } catch (error) {
        console.error("DB Fetch failed:", error)
    }

    return <PeriodsManager
        initialPeriods={periods}
        initialClasses={classes}
        initialTeachers={teachers}
    />
}
