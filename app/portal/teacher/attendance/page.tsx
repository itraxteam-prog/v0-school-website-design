import { AttendanceManager } from "@/components/portal/attendance-manager"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherAttendancePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  let classes: any[] = []

  try {
    const dbClasses = await prisma.class.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, subject: true },
      orderBy: { createdAt: "desc" }
    })

    if (dbClasses.length > 0) {
      classes = dbClasses.map(c => ({
        id: c.id,
        name: `${c.name} (${c.subject || 'General'})`
      }))
    } else {
      // Baseline Mock Data for Prototype
      classes = [
        { id: "c1", name: "10-A (Mathematics)" },
        { id: "c2", name: "10-B (Algebra)" },
        { id: "c3", name: "9-A (General Science)" },
      ];
    }
  } catch (error) {
    console.error("Failed to fetch teacher classes for attendance", error)
    classes = [
      { id: "c1", name: "10-A (Mathematics)" },
    ];
  }

  return <AttendanceManager initialClasses={classes} />
}
