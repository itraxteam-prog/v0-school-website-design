import { prisma } from "@/lib/prisma"
import { TeachersManager } from "@/components/portal/teachers-manager"
import { MOCK_USERS } from "@/utils/mocks"
import { logger } from "@/lib/logger"

export default async function AdminTeachersPage() {
  // Try to fetch from database
  let teachers: any[] = []
  try {
    teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        name: true,
        email: true,
        // Using any as these fields might not be in schema yet but are used in UI
      }
    })
  } catch (error) {
    logger.error({ error }, "DB Fetch failed, falling back to mocks")
    // Fallback if DB is empty/unreachable for this specific prototype
    teachers = MOCK_USERS
      .filter(u => u.role === "teacher")
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email
      }))
  }

  return <TeachersManager initialTeachers={teachers} />
}
