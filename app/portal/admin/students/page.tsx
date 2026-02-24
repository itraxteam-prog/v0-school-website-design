import { prisma } from "@/lib/prisma"
import { StudentsManager } from "@/components/portal/students-manager"
import { MOCK_USERS } from "@/utils/mocks"
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
    logger.error({ error }, "DB Fetch failed, falling back to mocks")
    // Fallback if DB is empty/unreachable for this specific prototype
    students = MOCK_USERS
      .filter(u => u.role === "student")
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email
      }))
  }

  return <StudentsManager initialStudents={students} />
}
