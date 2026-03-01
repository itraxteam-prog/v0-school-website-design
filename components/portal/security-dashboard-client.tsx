"use client"

import TwoFactorSetup from "@/components/portal/2fa-setup"
import { ChangePasswordForm } from "@/components/portal/change-password-form"
import { AppLayout } from "@/components/layout/app-layout"
import {
    ADMIN_SIDEBAR,
    TEACHER_SIDEBAR,
    STUDENT_SIDEBAR
} from "@/lib/navigation-config"
import { ShieldCheck, Lock, Smartphone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SecurityDashboardClient({ user }: { user: any }) {
    // Get sidebar items based on role
    const getSidebarItems = () => {
        const role = (user?.role || '').toUpperCase()
        switch (role) {
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
            userName={user?.name || user?.email?.split('@')[0] || "User"}
            userRole={user?.role || "user"}
        >
            <div className="flex flex-col gap-6 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-1 text-burgundy-gradient">Security Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your account protection and authentication methods.</p>
                </div>

                <Tabs defaultValue="two-factor" className="w-full">
                    <TabsList className="bg-muted/50 p-1 mb-6">
                        <TabsTrigger value="two-factor" className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Two-Factor Auth
                        </TabsTrigger>
                        <TabsTrigger value="password" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Change Password
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="two-factor" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <TwoFactorSetup />
                    </TabsContent>

                    <TabsContent value="password" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="max-w-4xl mx-auto">
                            <ChangePasswordForm user={user} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
