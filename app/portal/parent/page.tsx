"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
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

const MOCK_CHILDREN = [
    {
        id: "1",
        name: "Ahmed Ali",
        class: "Grade 10 - A",
        attendance: "92%",
        latestGrade: "A",
        nextClass: "Mathematics – 09:00 AM",
        unreadAnnouncements: 3,
    },
    {
        id: "2",
        name: "Sara Ali",
        class: "Grade 7 - B",
        attendance: "87%",
        latestGrade: "B+",
        nextClass: "English – 10:30 AM",
        unreadAnnouncements: 1,
    },
]

export default function ParentDashboard() {
    const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0])

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName="Parent User" userRole="Parent">
            <div className="flex flex-col gap-8 pb-8">
                {/* Welcome Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-1">
                        <h1 className="heading-1 text-burgundy-gradient">Welcome, Parent</h1>
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
                        {MOCK_CHILDREN.map((child) => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChild(child)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${selectedChild.id === child.id
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
                                    <h3 className="text-3xl font-bold tracking-tight">{selectedChild.attendance}</h3>
                                    <p className="text-xs font-medium mt-1 text-muted-foreground">Current semester</p>
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
                                    <h3 className="text-3xl font-bold tracking-tight">{selectedChild.latestGrade}</h3>
                                    <p className="text-xs font-medium mt-1 text-green-600">Most recent result</p>
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
                                    <h3 className="text-base font-bold tracking-tight leading-snug">
                                        {selectedChild.nextClass}
                                    </h3>
                                    <p className="text-xs font-medium mt-1 text-muted-foreground">Upcoming period</p>
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
                                    <h3 className="text-3xl font-bold tracking-tight">
                                        {selectedChild.unreadAnnouncements}
                                    </h3>
                                    <p className="text-xs font-medium mt-1 text-primary">Unread</p>
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
                                {selectedChild.name} — Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                                        Class
                                    </span>
                                    <Badge variant="outline" className="w-fit text-sm px-3 py-1">
                                        {selectedChild.class}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                                        Attendance Rate
                                    </span>
                                    <Badge variant="outline" className="w-fit text-sm px-3 py-1 border-green-400 text-green-700 dark:text-green-400">
                                        {selectedChild.attendance}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                                        Latest Grade
                                    </span>
                                    <Badge className="w-fit text-sm px-3 py-1 bg-primary text-white">
                                        {selectedChild.latestGrade}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-6">
                                Use the sidebar to view detailed grades, attendance records, timetable, and
                                announcements for {selectedChild.name.split(" ")[0]}.
                            </p>
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}
