import { prisma } from "@/lib/prisma"
import { TeachersManager } from "@/components/portal/teachers-manager"
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
        image: true,
      }
    })
  } catch (error) {
    logger.error({ error }, "Failed to fetch teachers from database");
    teachers = [];
  }


  return <TeachersManager initialTeachers={teachers} />
}
