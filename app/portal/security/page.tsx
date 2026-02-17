"use client"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { AppLayout } from "@/components/layout/app-layout"
import TwoFactorSetup from "@/components/portal/2fa-setup"
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    School,
    Clock,
    BarChart3,
    FileBarChart,
    Settings,
    ShieldCheck,
    BookOpen,
    CalendarCheck,
    Megaphone,
    User,
    Loader2
} from "lucide-react"

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
                return [
                    { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
                    { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
                    { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
                    { href: "/portal/admin/classes", label: "Classes", icon: School },
                    { href: "/portal/admin/users", label: "User Management", icon: Settings },
                    { href: "/portal/admin/school-settings", label: "School Settings", icon: Settings },
                    { href: "/portal/security", label: "Security", icon: ShieldCheck },
                ]
            case 'teacher':
                return [
                    { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
                    { href: "/portal/teacher/classes", label: "My Classes", icon: School },
                    { href: "/portal/teacher/students", label: "Students", icon: GraduationCap },
                    { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
                    { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookOpen },
                    { href: "/portal/security", label: "Security", icon: ShieldCheck },
                ]
            case 'student':
                return [
                    { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
                    { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
                    { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
                    { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
                    { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
                    { href: "/portal/student/profile", label: "Profile", icon: User },
                    { href: "/portal/security", label: "Security", icon: ShieldCheck },
                ]
            default:
                return [
                    { href: "/portal/security", label: "Security", icon: ShieldCheck },
                ]
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
