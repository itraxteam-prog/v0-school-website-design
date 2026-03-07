import { getServerSession } from "next-auth"
export const dynamic = 'force-dynamic';
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileView as AdminProfileView } from "@/components/portal/profile-view"
import { redirect } from "next/navigation"


export default async function AdminProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/portal/login")
    }

    const admin = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            profile: true,
        },
    });

    if (!admin) return <div>Admin not found</div>

    const adminData = {
        name: admin.name || "Administrator",
        email: admin.email || "admin@school.edu",
        designation: "System Administrator",
        id: `A-${admin.id.slice(0, 4)}`.toUpperCase(),
        status: admin.status,
        dob: admin.profile?.dateOfBirth ? admin.profile.dateOfBirth.toLocaleDateString() : "Not Specified",
        gender: admin.profile?.gender || "Not Specified",
        qualifications: admin.profile?.academicHistory?.toString() || "B.Tech / MBA",
        subjects: "All Access",
        classes: "System-wide",
        joiningDate: admin.createdAt.toLocaleDateString(),
        phone: admin.profile?.phone || "Not provided",
        address: admin.profile?.address || "Not provided",
        avatarUrl: admin.image || ""
    };

    return <AdminProfileView data={adminData} userRole="admin" />
}
