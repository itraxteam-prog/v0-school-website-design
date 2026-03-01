"use client"

import TwoFactorSetup from "@/components/portal/2fa-setup"
import { AppLayout } from "@/components/layout/app-layout"
import {
    ADMIN_SIDEBAR,
    TEACHER_SIDEBAR,
    STUDENT_SIDEBAR
} from "@/lib/navigation-config"
import { ShieldCheck } from "lucide-react"

export function SecurityDashboardClient({ user }: { user: any }) {
    // Get sidebar items based on role
    const getSidebarItems = () => {
        switch (user.role) {
            case 'ADMIN':
                return ADMIN_SIDEBAR
            case 'TEACHER':
                return TEACHER_SIDEBAR
            case 'STUDENT':
                return STUDENT_SIDEBAR
            default:
                return STUDENT_SIDEBAR
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
                    <h1 className="heading-1 text-burgundy-gradient">Two-Factor Authentication</h1>
                    <p className="text-sm text-muted-foreground">Manage your account two-factor authentication setup.</p>
                </div>

                <TwoFactorSetup />
            </div>
        </AppLayout>
    )
}
