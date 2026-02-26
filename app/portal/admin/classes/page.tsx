import { prisma } from "@/lib/prisma"
import { ClassesManager } from "@/components/portal/classes-manager"

export default async function AdminClassesPage() {
  let classes: any[] = []
  let periods: any[] = []

  try {
    const dbClasses = await prisma.class.findMany({
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { students: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    classes = dbClasses.map((c) => ({
      id: c.id,
      name: c.name,
      teacher: c.teacher?.name || c.teacher?.email || "Unassigned",
      teacherId: c.teacherId,
      room: "",
      studentCount: c._count.students,
    }))

    // Periods currently have no classId in schema — return empty
    periods = []
  } catch (error) {
    console.error("DB Fetch failed:", error)
    // Graceful fallback: empty lists, UI will show empty state
  }

  return <ClassesManager initialClasses={classes} initialPeriods={periods} />
}
