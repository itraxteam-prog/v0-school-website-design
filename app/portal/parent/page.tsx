"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import {
    LayoutDashboard,
    Clock,
    CalendarCheck,
    GraduationCap,
    Megaphone,
    TrendingUp,
    Users,
} from "lucide-react"

const PARENT_SIDEBAR = [
    { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/parent/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/parent/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/parent/grades", label: "Grades", icon: GraduationCap },
    { href: "/portal/parent/announcements", label: "Announcements", icon: Megaphone },
]

interface Child {
    id: string;
    name: string;
    class: string;
    rollNumber: string;
}

interface DashboardStats {
    attendance: string;
    latestGrade: string;
    nextClass: string;
    unreadAnnouncements: number;
}

export default function ParentDashboard() {
    const { data: session } = useSession()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(false)

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await fetch("/api/parent/children")
                if (res.ok) {
                    const data = await res.json()
                    setChildren(data)
                    if (data.length > 0) {
                        setSelectedChild(data[0])
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
        if (!selectedChild) return

        const fetchStats = async () => {
            setStatsLoading(true)
            try {
                // Fetch basic stats in parallel
                const [gradesRes, attendanceRes, timetableRes, announcementsRes] = await Promise.all([
                    fetch(`/api/parent/child/${selectedChild.id}/grades`),
                    fetch(`/api/parent/child/${selectedChild.id}/attendance`),
                    fetch(`/api/parent/child/${selectedChild.id}/timetable`),
                    fetch(`/api/parent/child/${selectedChild.id}/announcements`),
                ])

                const [grades, attendance, timetable, announcements] = await Promise.all([
                    gradesRes.ok ? gradesRes.json() : [],
                    attendanceRes.ok ? attendanceRes.json() : [],
                    timetableRes.ok ? timetableRes.json() : [],
                    announcementsRes.ok ? announcementsRes.json() : [],
                ])

                // Calculate attendance %
                const presentCount = attendance.filter((a: any) => a.status === "PRESENT").length
                const attendanceRate = attendance.length > 0
                    ? Math.round((presentCount / attendance.length) * 100) + "%"
                    : "0%"

                // Get latest grade
                const latestGrade = grades.length > 0
                    ? grades[0].marks + " (" + grades[0].term + ")"
                    : "No data"

                // Get next class (simplified: first class of the day or first in list)
                const nextClass = timetable.length > 0
                    ? `${timetable[0].subjectName} – ${timetable[0].startTime}`
                    : "No classes"

                setStats({
                    attendance: attendanceRate,
                    latestGrade,
                    nextClass,
                    unreadAnnouncements: announcements.length,
                })
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            } finally {
                setStatsLoading(false)
            }
        }
        fetchStats()
    }, [selectedChild])

    if (loading) {
        return (
            <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
                <div className="flex flex-col gap-8 pb-8">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-10 w-full" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (children.length === 0) {
        return (
            <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <Users className="h-16 w-16 text-muted-foreground opacity-20" />
                    <h2 className="text-2xl font-bold">No Children Linked</h2>
                    <p className="text-muted-foreground text-center max-w-sm">
                        There are no students linked to your parent account. Please contact the school administration if this is an error.
                    </p>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
            <div className="flex flex-col gap-8 pb-8">
                {/* Welcome Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-1">
                        <h1 className="heading-1 text-burgundy-gradient">Welcome, {session?.user?.name?.split(" ")[0]}</h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor your children&apos;s academic progress at a glance.
                        </p>
                    </div>
                </AnimatedWrapper>

                {/* Child Selector */}
                <AnimatedWrapper delay={0.1}>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" /> Select Child:
                        </span>
                        {children.map((child) => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChild(child)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${selectedChild?.id === child.id
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>
                </AnimatedWrapper>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <AnimatedWrapper delay={0.15}>
                        <Card className="glass-panel border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <CalendarCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {statsLoading ? <Skeleton className="h-9 w-16" /> : (
                                        <>
                                            <h3 className="text-3xl font-bold tracking-tight">{stats?.attendance}</h3>
                                            <p className="text-xs font-medium mt-1 text-muted-foreground">Current semester</p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </AnimatedWrapper>

                    <AnimatedWrapper delay={0.2}>
                        <Card className="glass-panel border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">Latest Grade</p>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {statsLoading ? <Skeleton className="h-9 w-24" /> : (
                                        <>
                                            <h3 className="text-xl font-bold tracking-tight truncate">{stats?.latestGrade}</h3>
                                            <p className="text-xs font-medium mt-1 text-green-600">Most recent result</p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </AnimatedWrapper>

                    <AnimatedWrapper delay={0.25}>
                        <Card className="glass-panel border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">Next Class</p>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {statsLoading ? <Skeleton className="h-9 w-full" /> : (
                                        <>
                                            <h3 className="text-base font-bold tracking-tight leading-snug">
                                                {stats?.nextClass}
                                            </h3>
                                            <p className="text-xs font-medium mt-1 text-muted-foreground">Upcoming period</p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </AnimatedWrapper>

                    <AnimatedWrapper delay={0.3}>
                        <Card className="glass-panel border-border/50 border-primary/50 shadow-md ring-1 ring-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">Announcements</p>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                        <Megaphone className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {statsLoading ? <Skeleton className="h-9 w-12" /> : (
                                        <>
                                            <h3 className="text-3xl font-bold tracking-tight">
                                                {stats?.unreadAnnouncements}
                                            </h3>
                                            <p className="text-xs font-medium mt-1 text-primary">Active</p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </AnimatedWrapper>
                </div>

                {/* Child Info Panel */}
                <AnimatedWrapper delay={0.35}>
                    <Card className="glass-panel border-border/50">
                        <CardHeader>
                            <CardTitle className="heading-3 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                {selectedChild?.name} — Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                                        Class
                                    </span>
                                    <Badge variant="outline" className="w-fit text-sm px-3 py-1">
                                        {selectedChild?.class}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                                        Attendance Rate
                                    </span>
                                    <Badge variant="outline" className="w-fit text-sm px-3 py-1 border-green-400 text-green-700 dark:text-green-400">
                                        {stats?.attendance}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                                        Roll Number
                                    </span>
                                    <Badge variant="outline" className="w-fit text-sm px-3 py-1">
                                        {selectedChild?.rollNumber}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-6">
                                Use the sidebar to view detailed grades, attendance records, timetable, and
                                announcements for {selectedChild?.name?.split(" ")[0]}.
                            </p>
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}
