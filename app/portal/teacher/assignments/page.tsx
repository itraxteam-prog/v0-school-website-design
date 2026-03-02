import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AssignmentsManager } from "@/components/portal/assignments-manager"
import { redirect } from "next/navigation"

export default async function TeacherAssignmentsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "TEACHER") {
        redirect("/portal/login")
    }

    const classes = await prisma.class.findMany({
        where: { teacherId: session.user.id },
        select: { id: true, name: true },
    })

    return <AssignmentsManager initialClasses={classes} />
}
