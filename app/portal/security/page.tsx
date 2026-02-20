"use client"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { AppLayout } from "@/components/layout/app-layout"
import TwoFactorSetup from "@/components/portal/2fa-setup"
import {
    ADMIN_SIDEBAR,
    TEACHER_SIDEBAR,
    STUDENT_SIDEBAR
} from "@/lib/navigation-config"

export default function SecurityPage() {
    const { user, loading } = useRequireAuth(['admin', 'teacher', 'student'])

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    // Get sidebar items based on role
    const getSidebarItems = () => {
        switch (user.role) {
            case 'admin':
                return ADMIN_SIDEBAR
            case 'teacher':
                return TEACHER_SIDEBAR
            case 'student':
                return STUDENT_SIDEBAR
            default:
                return [{ href: "/portal/security", label: "Security", icon: ShieldCheck }]
        }
    }

    return (
        <AppLayout
            sidebarItems={getSidebarItems()}
            userName={user.name}
            userRole={user.role}
        >
            <div className="flex flex-col gap-8 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-1 text-burgundy-gradient">Security Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your account security and two-factor authentication.</p>
                </div>

                <TwoFactorSetup />
            </div>
        </AppLayout>
    )
}
