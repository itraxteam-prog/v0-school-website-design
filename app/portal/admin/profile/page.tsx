import { getServerSession } from "next-auth"
export const dynamic = 'force-dynamic';
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileView as AdminProfileView } from "@/components/portal/profile-view"
import { redirect } from "next/navigation"


export default async function AdminProfilePage() {
    try {
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

        if (!admin) return <div className="p-8 text-center text-muted-foreground italic">Admin not found (Session invalid or database out of sync)</div>

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
            joiningDate: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A',
            phone: admin.profile?.phone || "",
            address: admin.profile?.address || "",
            avatarUrl: admin.image || ""
        };

        return <AdminProfileView data={adminData} userRole="admin" />
    } catch (error) {
        console.error("Critical error in AdminProfilePage:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-4">
                <div className="text-burgundy-900 font-bold text-xl">Something went wrong while loading your profile.</div>
                <p className="text-muted-foreground text-center">This could be due to a temporary database connection issue. Please try refreshing the page.</p>
                <a href="/portal/admin" className="text-primary hover:underline">Return to Dashboard</a>
            </div>
        );
    }
}
