"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
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

interface AttendanceRecord {
    date: string;
    status: string;
    class: { name: string };
}

interface Child {
    id: string;
    name: string;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; iconClass: string; bgClass: string }> = {
    PRESENT: { label: "Present", badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", iconClass: "text-green-600 dark:text-green-400", bgClass: "bg-green-100 dark:bg-green-900/30" },
    ABSENT: { label: "Absent", badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", iconClass: "text-red-600 dark:text-red-400", bgClass: "bg-red-100 dark:bg-red-900/30" },
    LATE: { label: "Late", badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400", bgClass: "bg-amber-100 dark:bg-amber-900/30" },
    EXCUSED: { label: "Excused", badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400", bgClass: "bg-blue-100 dark:bg-blue-900/30" },
}

const STATUS_ICONS: Record<string, any> = {
    PRESENT: CheckCircle2,
    ABSENT: XCircle,
    LATE: AlertCircle,
    EXCUSED: ShieldCheck,
}

export default function ParentAttendancePage() {
    const { data: session } = useSession()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChildId, setSelectedChildId] = useState<string>("")
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [recordsLoading, setRecordsLoading] = useState(false)

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await fetch("/api/parent/children")
                if (res.ok) {
                    const data = await res.json()
                    setChildren(data)
                    if (data.length > 0) {
                        setSelectedChildId(data[0].id)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch children:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchChildren()
    }, [])

    useEffect(() => {
        if (!selectedChildId) return

        const fetchAttendance = async () => {
            setRecordsLoading(true)
            try {
                const res = await fetch(`/api/parent/child/${selectedChildId}/attendance`)
                if (res.ok) {
                    const data = await res.json()
                    setRecords(data)
                }
            } catch (error) {
                console.error("Failed to fetch attendance:", error)
            } finally {
                setRecordsLoading(false)
            }
        }
        fetchAttendance()
    }, [selectedChildId])

    const stats = records.reduce(
        (acc, r) => {
            const status = r.status.toUpperCase()
            if (status in acc) acc[status as keyof typeof acc]++
            return acc
        },
        { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 }
    )

    const selectedChildName = children.find(c => c.id === selectedChildId)?.name || "Child"

    if (loading) {
        return (
            <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
                <Skeleton className="h-12 w-64 mb-8" />
                <Skeleton className="h-64 w-full" />
            </AppLayout>
        )
    }

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
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
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <SelectValue placeholder="Select Child" />
                            </SelectTrigger>
                            <SelectContent>
                                {children.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AnimatedWrapper>

                {/* Stats Cards */}
                <AnimatedWrapper delay={0.1}>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((key) => {
                            const cfg = STATUS_CONFIG[key]
                            const Icon = STATUS_ICONS[key] || HelpCircle
                            return (
                                <Card key={key} className="glass-panel overflow-hidden border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground capitalize">{key.toLowerCase()}</p>
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
                                {selectedChildName} — Attendance Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recordsLoading ? (
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                                <TableHead>Date</TableHead>
                                                <TableHead>Subject / Class</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {records.length > 0 ? (
                                                records.map((row, i) => {
                                                    const status = row.status.toUpperCase()
                                                    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PRESENT
                                                    return (
                                                        <TableRow key={i} className="group border-border/50 transition-colors hover:bg-primary/5">
                                                            <TableCell className="text-muted-foreground">
                                                                {new Date(row.date).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="font-medium">{row.class.name}</TableCell>
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
                            )}
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}

function HelpCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
    )
}
