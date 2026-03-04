"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import {
    LayoutDashboard,
    Clock,
    CalendarCheck,
    GraduationCap,
    Megaphone,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ShieldCheck,
    Users,
} from "lucide-react"

const PARENT_SIDEBAR = [
    { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/parent/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/parent/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/parent/grades", label: "Grades", icon: GraduationCap },
    { href: "/portal/parent/announcements", label: "Announcements", icon: Megaphone },
]

const MOCK_CHILDREN = ["Ahmed Ali", "Sara Ali"]

const MOCK_ATTENDANCE: Record<string, { date: string; subject: string; status: string }[]> = {
    "Ahmed Ali": [
        { date: "Mar 03, 2026", subject: "Mathematics", status: "present" },
        { date: "Mar 03, 2026", subject: "Physics", status: "present" },
        { date: "Mar 02, 2026", subject: "English", status: "absent" },
        { date: "Mar 02, 2026", subject: "Chemistry", status: "present" },
        { date: "Mar 01, 2026", subject: "Computer Science", status: "late" },
        { date: "Feb 28, 2026", subject: "Urdu", status: "present" },
        { date: "Feb 28, 2026", subject: "Mathematics", status: "excused" },
        { date: "Feb 27, 2026", subject: "Physics", status: "present" },
    ],
    "Sara Ali": [
        { date: "Mar 03, 2026", subject: "Mathematics", status: "present" },
        { date: "Mar 03, 2026", subject: "English", status: "late" },
        { date: "Mar 02, 2026", subject: "Islamiat", status: "present" },
        { date: "Mar 01, 2026", subject: "Urdu", status: "absent" },
        { date: "Feb 28, 2026", subject: "Mathematics", status: "present" },
    ],
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; iconClass: string; bgClass: string }> = {
    present: { label: "Present", badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", iconClass: "text-green-600 dark:text-green-400", bgClass: "bg-green-100 dark:bg-green-900/30" },
    absent: { label: "Absent", badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", iconClass: "text-red-600 dark:text-red-400", bgClass: "bg-red-100 dark:bg-red-900/30" },
    late: { label: "Late", badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400", bgClass: "bg-amber-100 dark:bg-amber-900/30" },
    excused: { label: "Excused", badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400", bgClass: "bg-blue-100 dark:bg-blue-900/30" },
}

const STATUS_ICONS = {
    present: CheckCircle2,
    absent: XCircle,
    late: AlertCircle,
    excused: ShieldCheck,
}

export default function ParentAttendancePage() {
    const [selectedChild, setSelectedChild] = useState("Ahmed Ali")

    const records = MOCK_ATTENDANCE[selectedChild] || []

    const stats = records.reduce(
        (acc, r) => {
            if (r.status in acc) acc[r.status as keyof typeof acc]++
            return acc
        },
        { present: 0, absent: 0, late: 0, excused: 0 }
    )

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName="Parent User" userRole="Parent">
            <div className="flex flex-col gap-8 pb-8">
                {/* Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="heading-1 text-burgundy-gradient">Attendance</h1>
                            <p className="text-sm text-muted-foreground">
                                View your child&apos;s attendance record.
                            </p>
                        </div>
                        <Select value={selectedChild} onValueChange={setSelectedChild}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <SelectValue placeholder="Select Child" />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_CHILDREN.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AnimatedWrapper>

                {/* Stats Cards */}
                <AnimatedWrapper delay={0.1}>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {(["present", "absent", "late", "excused"] as const).map((key) => {
                            const cfg = STATUS_CONFIG[key]
                            const Icon = STATUS_ICONS[key]
                            return (
                                <Card key={key} className="glass-panel overflow-hidden border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground capitalize">{key}</p>
                                                <p className="mt-2 text-3xl font-bold">{stats[key]}</p>
                                            </div>
                                            <div className={`rounded-full p-3 ${cfg.bgClass}`}>
                                                <Icon className={`h-6 w-6 ${cfg.iconClass}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </AnimatedWrapper>

                {/* Attendance Table */}
                <AnimatedWrapper delay={0.2}>
                    <Card className="glass-panel overflow-hidden border-border/50">
                        <CardHeader>
                            <CardTitle className="heading-3 flex items-center gap-2">
                                <CalendarCheck className="h-5 w-5 text-primary" />
                                {selectedChild} — Attendance Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                            <TableHead>Date</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {records.length > 0 ? (
                                            records.map((row, i) => {
                                                const cfg = STATUS_CONFIG[row.status]
                                                return (
                                                    <TableRow key={i} className="group border-border/50 transition-colors hover:bg-primary/5">
                                                        <TableCell className="text-muted-foreground">{row.date}</TableCell>
                                                        <TableCell className="font-medium">{row.subject}</TableCell>
                                                        <TableCell className="text-right">
                                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badgeClass}`}>
                                                                {cfg.label}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                    No attendance records found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}
