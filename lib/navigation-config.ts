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
    { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

export const TEACHER_SIDEBAR = [
    { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/teacher/classes", label: "My Classes", icon: School },
    { href: "/portal/teacher/students", label: "My Students", icon: GraduationCap },
    { href: "/portal/teacher/subjects", label: "Subjects & Syllabus", icon: BookMarked },
    { href: "/portal/teacher/exams", label: "Exams & Grading", icon: FileBarChart },
    { href: "/portal/teacher/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/teacher/profile", label: "My Profile", icon: User },
    { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

export const STUDENT_SIDEBAR = [
    { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/student/academics", label: "Academics", icon: GraduationCap },
    { href: "/portal/student/exams", label: "Exams & Results", icon: FileBarChart },
    { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
    { href: "/portal/student/profile", label: "My Profile", icon: User },
    { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

export const PUBLIC_NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/academics", label: "Academics" },
    { href: "/admissions", label: "Admissions" },
    { href: "/contact", label: "Contact" },
]
