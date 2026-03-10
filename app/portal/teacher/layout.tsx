import { requireRole } from "@/lib/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { TEACHER_SIDEBAR } from "@/lib/navigation-config";
import { prisma } from "@/lib/prisma";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireRole("TEACHER");

    // Fetch initial preferences for server-side theme detection
    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { academicHistory: true }
    });
    const preferences = (profile?.academicHistory as any) || {};
    const initialIsDark = preferences['darkMode_teacher'] === true || (preferences['darkMode_teacher'] === undefined && preferences.darkMode === true);

    return (
        <AppLayout
            sidebarItems={TEACHER_SIDEBAR}
            userName={session.user.name || "Teacher"}
            userRole="teacher"
            userImage={session.user.image || undefined}
            initialIsDark={initialIsDark}
            initialPreferences={preferences}
        >
            {children}
        </AppLayout>
    );
}
