import { prisma } from "@/lib/prisma"
import { ClassesManager } from "@/components/portal/classes-manager"

export default async function AdminClassesPage() {
  // Try to fetch from database
  let classes: any[] = []
  let periods: any[] = []

  try {
    // Mock Class Data Baseline for Prototype
    classes = [
      { id: "cls-001", name: "Grade 10-A", teacher: "Sarah Jenkins", room: "Room 201", studentCount: 32 },
      { id: "cls-002", name: "Grade 9-B", teacher: "John Smith", room: "Room 105", studentCount: 28 },
      { id: "cls-003", name: "Grade 8-C", teacher: "Emma Watson", room: "Room 302", studentCount: 25 },
    ];

    // Mock Period Data Baseline for Prototype
    periods = [
      { id: "p-1", classId: "cls-001", name: "Mathematics", startTime: "08:30", endTime: "09:30" },
      { id: "p-2", classId: "cls-001", name: "Physics", startTime: "09:30", endTime: "10:30" },
      { id: "p-3", classId: "cls-002", name: "English", startTime: "08:30", endTime: "09:30" },
    ];
  } catch (error) {
    console.error("DB Fetch failed:", error)
  }

  return <ClassesManager initialClasses={classes} initialPeriods={periods} />
}
