"use client"

import { useTheme } from "next-themes"
import TwoFactorSetup from "@/components/portal/2fa-setup"
import { ChangePasswordForm } from "@/components/portal/change-password-form"
import AppLayout from "@/components/layout/AppLayout"
import {
    ADMIN_SIDEBAR,
    TEACHER_SIDEBAR,
    STUDENT_SIDEBAR
} from "@/lib/navigation-config"
import { ShieldCheck, Lock, Smartphone, Moon, Sun, Palette } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SecurityDashboardClient({ user }: { user: any }) {
    const { theme, setTheme } = useTheme()

    // Get sidebar items based on role - robust version
    const getSidebarItems = () => {
        if (!user || !user.role) return STUDENT_SIDEBAR;
        const role = String(user.role).toUpperCase()

        if (role === 'ADMIN') return ADMIN_SIDEBAR
        if (role === 'TEACHER') return TEACHER_SIDEBAR
        if (role === 'STUDENT') return STUDENT_SIDEBAR

        return STUDENT_SIDEBAR
    }

    const safeUserName = user?.name || user?.email?.split('@')[0] || "User";
    const safeUserRole = (user?.role || "user").toLowerCase();

    return (
        <AppLayout
            sidebarItems={getSidebarItems()}
            userName={safeUserName}
            userRole={safeUserRole}
        >
            <div className="flex flex-col gap-6 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-1 text-burgundy-gradient">Security Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your account protection, authentication methods, and portal preferences.</p>
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
                        <TabsTrigger value="appearance" className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Appearance
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

                    <TabsContent value="appearance" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="max-w-4xl mx-auto">
                            <Card className="glass-panel border-border/50">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Palette className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">Portal Appearance</CardTitle>
                                            <CardDescription>Customize how the portal looks on your device.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                {theme === 'dark' ? (
                                                    <Moon className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <Sun className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="dark-mode" className="text-sm font-semibold cursor-pointer">Dark Mode</Label>
                                                <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            id="dark-mode"
                                            checked={theme === 'dark'}
                                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
