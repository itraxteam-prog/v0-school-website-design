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
    Users,
} from "lucide-react"

const PARENT_SIDEBAR = [
    { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/parent/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/parent/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/parent/grades", label: "Grades", icon: GraduationCap },
    { href: "/portal/parent/announcements", label: "Announcements", icon: Megaphone },
    { href: "/portal/parent/profile", label: "Profile", icon: Users },
]

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

interface TimetableEntry {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: { name: string };
    room?: string;
}

interface Child {
    id: string;
    name: string;
}

export default function ParentTimetablePage() {
    const { data: session } = useSession()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChildId, setSelectedChildId] = useState<string>("")
    const [timetable, setTimetable] = useState<TimetableEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [timetableLoading, setTimetableLoading] = useState(false)

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

        const fetchTimetable = async () => {
            setTimetableLoading(true)
            try {
                const res = await fetch(`/api/parent/child/${selectedChildId}/timetable`)
                if (res.ok) {
                    const data = await res.json()
                    setTimetable(data)
                }
            } catch (error) {
                console.error("Failed to fetch timetable:", error)
            } finally {
                setTimetableLoading(false)
            }
        }
        fetchTimetable()
    }, [selectedChildId])

    // Grouping logic for the grid
    const scheduleByDay: Record<string, TimetableEntry[]> = {}
    DAYS_OF_WEEK.forEach(day => {
        scheduleByDay[day] = timetable.filter(t => t.dayOfWeek === day)
    })

    const allSlots = Array.from(
        new Set(
            timetable.map((s) => `${s.startTime} - ${s.endTime}`)
        )
    ).sort()

    const selectedChildName = children.find(c => c.id === selectedChildId)?.name || "Child"

    if (loading) {
        return (
            <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
                <Skeleton className="h-12 w-64 mb-8" />
                <Skeleton className="h-96 w-full" />
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
                            <h1 className="heading-1 text-burgundy-gradient">Timetable</h1>
                            <p className="text-sm text-muted-foreground">
                                Weekly class schedule for your child.
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

                {/* Timetable Grid */}
                <AnimatedWrapper delay={0.2}>
                    <Card className="glass-panel overflow-hidden border-border/50">
                        <CardHeader>
                            <CardTitle className="heading-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                {selectedChildName} — Weekly Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {timetableLoading ? (
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-32 w-full" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                                <TableHead className="w-[120px] font-semibold">Time</TableHead>
                                                {DAYS_OF_WEEK.map((day) => (
                                                    <TableHead key={day} className="min-w-[150px] text-center font-semibold text-xs capitalize">
                                                        {day.toLowerCase()}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allSlots.length > 0 ? (
                                                allSlots.map((slot, idx) => (
                                                    <TableRow key={idx} className="border-border/50">
                                                        <TableCell className="font-medium text-muted-foreground">
                                                            <div className="text-xs">
                                                                <div className="font-semibold text-primary">Period {idx + 1}</div>
                                                                <div className="text-muted-foreground/70">{slot}</div>
                                                            </div>
                                                        </TableCell>
                                                        {DAYS_OF_WEEK.map((day) => {
                                                            const cls = scheduleByDay[day]?.find(
                                                                (s) => `${s.startTime} - ${s.endTime}` === slot
                                                            )
                                                            if (!cls)
                                                                return (
                                                                    <TableCell key={day} className="text-center text-muted-foreground/30 font-mono text-xs">
                                                                        —
                                                                    </TableCell>
                                                                )
                                                            return (
                                                                <TableCell key={day} className="p-2">
                                                                    <div className="group rounded-lg border p-3 border-border bg-background transition-all hover:scale-[1.02] hover:shadow-md">
                                                                        <div className="text-sm font-semibold text-primary">{cls.subject}</div>
                                                                        <div className="mt-1 text-xs text-muted-foreground font-medium">{cls.teacher.name}</div>
                                                                        {cls.room && (
                                                                            <div className="mt-0.5 text-xs text-muted-foreground/60">{cls.room}</div>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            )
                                                        })}
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={DAYS_OF_WEEK.length + 1}
                                                        className="h-32 text-center text-muted-foreground italic"
                                                    >
                                                        No schedule data found for this child.
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
