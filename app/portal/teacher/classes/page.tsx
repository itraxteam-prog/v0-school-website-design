import { ClassesView } from "@/components/portal/classes-view"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherClassesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  let classes: any[] = []

  try {
    const dbClasses = await prisma.class.findMany({
      where: { teacherId: session.user.id },
      include: {
        _count: { select: { students: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    if (dbClasses.length > 0) {
      classes = dbClasses.map((c, i) => {
        const gradients = [
          "from-blue-500/10 to-blue-500/5",
          "from-emerald-500/10 to-emerald-500/5",
          "from-amber-500/10 to-amber-500/5",
          "from-purple-500/10 to-purple-500/5"
        ]
        return {
          id: c.id,
          name: c.name,
          subject: c.subject || "General",
          studentCount: c._count.students,
          room: "TBA",
          performance: 0, // Performance calculation is complex
          color: gradients[i % gradients.length],
        }
      })
    } else {
      // Baseline Mock Data for Prototype if nothing in DB
      classes = [
        {
          id: "c1",
          name: "Mathematics 10-A",
          subject: "Advanced Mathematics",
          studentCount: 32,
          room: "Room 102",
          performance: 88,
          color: "from-blue-500/10 to-blue-500/5",
        },
        {
          id: "c2",
          name: "Algebra 10-B",
          subject: "Linear Algebra",
          studentCount: 28,
          room: "Room 104",
          performance: 82,
          color: "from-emerald-500/10 to-emerald-500/5",
        }
      ];
    }
  } catch (error) {
    console.error("Failed to fetch teacher classes", error)
  }

  return <ClassesView initialClasses={classes} />
}
