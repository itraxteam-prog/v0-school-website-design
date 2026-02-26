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
    BookMarked,
    CalendarCheck,
    User,
    FileText,
    Megaphone,
    Calendar,
    BookOpen
} from "lucide-react"

export const ADMIN_SIDEBAR = [
    { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
    { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
    { href: "/portal/admin/classes", label: "Classes", icon: School },
    { href: "/portal/admin/periods", label: "Periods", icon: Clock },
    { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
    { href: "/portal/admin/users", label: "User Management", icon: Settings },
    { href: "/portal/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
    { href: "/portal/admin/school-settings", label: "School Settings", icon: Settings },
    { href: "/portal/admin/security", label: "Security", icon: ShieldCheck },
]

export const TEACHER_SIDEBAR = [
    { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/teacher/classes", label: "My Classes", icon: School },
    { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
    { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
    { href: "/portal/teacher/profile", label: "My Profile", icon: User },
    { href: "/portal/teacher/security", label: "Security", icon: ShieldCheck },
]

export const STUDENT_SIDEBAR = [
    { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/student/grades", label: "My Grades", icon: GraduationCap },
    { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
    { href: "/portal/student/profile", label: "My Profile", icon: User },
    { href: "/portal/student/security", label: "Security", icon: ShieldCheck },
]

export const PUBLIC_NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/academics", label: "Academics" },
    { href: "/admissions", label: "Admissions" },
    { href: "/contact", label: "Contact" },
]
