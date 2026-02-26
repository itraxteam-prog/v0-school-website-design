import { prisma } from "@/lib/prisma"
import { StudentsManager } from "@/components/portal/students-manager"
import { logger } from "@/lib/logger"

export default async function AdminStudentsPage() {
  // Try to fetch from database
  let students: any[] = []
  try {
    students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })
    } catch (error) {
        logger.error({ error }, "Failed to fetch students from database");
        students = [];
    }


  return <StudentsManager initialStudents={students} />
}
