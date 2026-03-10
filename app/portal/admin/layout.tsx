import { requireRole } from "@/lib/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { ADMIN_SIDEBAR } from "@/lib/navigation-config";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireRole("ADMIN");

    // Fetch initial preferences for server-side theme detection
    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { academicHistory: true }
    });
    const preferences = (profile?.academicHistory as any) || {};
    const initialIsDark = preferences['darkMode_admin'] === true || (preferences['darkMode_admin'] === undefined && preferences.darkMode === true);

    return (
        <AppLayout
            sidebarItems={ADMIN_SIDEBAR}
            userName={session.user.name || "Admin"}
            userRole="admin"
            userImage={session.user.image || undefined}
            initialIsDark={initialIsDark}
            initialPreferences={preferences}
        >
            {children}
        </AppLayout>
    );
}
