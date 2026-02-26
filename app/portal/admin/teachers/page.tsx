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
        // Using any as these fields might not be in schema yet but are used in UI
      }
    })
    } catch (error) {
        logger.error({ error }, "Failed to fetch teachers from database");
        teachers = [];
    }


  return <TeachersManager initialTeachers={teachers} />
}
