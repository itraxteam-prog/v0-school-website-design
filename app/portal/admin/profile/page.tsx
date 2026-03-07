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

    const history = (admin.profile?.academicHistory as any) || {};

    const adminData = {
        name: admin.name || "Administrator",
        email: admin.email || "",
        designation: history.designation || "System Administrator",
        id: admin.profile?.rollNumber || `A-${admin.id.slice(0, 4)}`.toUpperCase(),
        status: admin.status,
        dob: admin.profile?.dateOfBirth ? admin.profile.dateOfBirth.toISOString().split('T')[0] : "",
        gender: admin.profile?.gender || "",
        qualifications: history.qualifications || "B.Tech / MBA",
        subjects: history.subjects || "All Access",
        classes: history.classes || "System-wide",
        joiningDate: admin.createdAt.toLocaleDateString(),
        phone: admin.profile?.phone || "",
        address: admin.profile?.address || "",
        avatarUrl: admin.image || ""
    };

    return <AdminProfileView data={adminData} userRole="admin" />
}
