import { prisma } from "@/lib/prisma"
import { AnnouncementsManager } from "@/components/portal/announcements-manager"
import { requireRole } from "@/lib/auth-guard"

export default async function AdminAnnouncementsPage() {
    await requireRole("ADMIN")

    const announcements = await prisma.announcement.findMany({
        include: {
            author: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" }
    })

    return <AnnouncementsManager initialAnnouncements={announcements} />
}
