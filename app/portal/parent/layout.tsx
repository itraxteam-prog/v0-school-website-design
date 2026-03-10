import { requireRole } from "@/lib/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { PARENT_SIDEBAR } from "@/lib/navigation-config";
import { prisma } from "@/lib/prisma";

export default async function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireRole("PARENT");

    // Fetch initial preferences for server-side theme detection
    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { academicHistory: true }
    });
    const preferences = (profile?.academicHistory as any) || {};
    const initialIsDark = preferences['darkMode_parent'] === true || (preferences['darkMode_parent'] === undefined && preferences.darkMode === true);

    return (
        <AppLayout
            sidebarItems={PARENT_SIDEBAR}
            userName={session.user.name || "Parent"}
            userRole="parent"
            userImage={session.user.image || undefined}
            initialIsDark={initialIsDark}
            initialPreferences={preferences}
        >
            {children}
        </AppLayout>
    );
}
