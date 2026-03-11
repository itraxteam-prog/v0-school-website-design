import { requireRole } from "@/lib/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { STUDENT_SIDEBAR } from "@/lib/navigation-config";
import { prisma } from "@/lib/prisma";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireRole("STUDENT");

    // Fetch initial preferences for server-side theme detection
    let preferences = {};
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { academicHistory: true }
        });
        preferences = (profile?.academicHistory as any) || {};
    } catch (e) {
        console.error("Failed to fetch user preferences", e);
    }

    const initialIsDark = (preferences as any)['darkMode_student'] === true || ((preferences as any)['darkMode_student'] === undefined && (preferences as any).darkMode === true);

    return (
        <AppLayout
            sidebarItems={STUDENT_SIDEBAR}
            userName={session.user.name || "Student"}
            userRole="student"
            userImage={session.user.image || undefined}
            initialIsDark={initialIsDark}
            initialPreferences={preferences}
        >
            {children}
        </AppLayout>
    );
}
