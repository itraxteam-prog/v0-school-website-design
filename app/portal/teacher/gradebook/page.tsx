import { GradebookManager } from "@/components/portal/gradebook-manager"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherGradeEntryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  let classes: any[] = []
  let subjects: any[] = []

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

      // Extract unique subjects from classes
      const uniqueSubjects = Array.from(new Set(dbClasses.map(c => c.subject || "General")))
      subjects = uniqueSubjects.map(s => ({
        id: s.toLowerCase().replace(/\s+/g, '-'),
        name: s
      }))
    } else {
      // Baseline Mock Data for Prototype
      classes = [
        { id: "c1", name: "10-A (Mathematics)" },
        { id: "c2", name: "10-B (Algebra)" },
      ];
      subjects = [
        { id: "math", name: "Mathematics" },
        { id: "algb", name: "Algebra" },
      ];
    }
  } catch (error) {
    console.error("Failed to fetch teacher data for gradebook", error)
    classes = [{ id: "c1", name: "10-A (Mathematics)" }];
    subjects = [{ id: "math", name: "Mathematics" }];
  }

  return <GradebookManager initialClasses={classes} initialSubjects={subjects} />
}
