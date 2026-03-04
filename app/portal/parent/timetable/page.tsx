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

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface ClassPeriod {
    subject: string
    teacher: string
    room: string
    startTime: string
    endTime: string
}

type DaySchedule = { [day: string]: ClassPeriod[] }

const MOCK_TIMETABLE: Record<string, DaySchedule> = {
    "Ahmed Ali": {
        Monday: [
            { subject: "Mathematics", teacher: "Mr. Khalid", room: "Room 101", startTime: "08:00", endTime: "09:00" },
            { subject: "Physics", teacher: "Ms. Fatima", room: "Lab 1", startTime: "09:00", endTime: "10:00" },
            { subject: "English", teacher: "Mr. Tariq", room: "Room 103", startTime: "10:30", endTime: "11:30" },
        ],
        Tuesday: [
            { subject: "Chemistry", teacher: "Ms. Amina", room: "Lab 2", startTime: "08:00", endTime: "09:00" },
            { subject: "Computer Science", teacher: "Mr. Bilal", room: "CS Lab", startTime: "09:00", endTime: "10:00" },
        ],
        Wednesday: [
            { subject: "Mathematics", teacher: "Mr. Khalid", room: "Room 101", startTime: "08:00", endTime: "09:00" },
            { subject: "Urdu", teacher: "Ms. Zara", room: "Room 105", startTime: "10:30", endTime: "11:30" },
        ],
        Thursday: [
            { subject: "Physics", teacher: "Ms. Fatima", room: "Lab 1", startTime: "09:00", endTime: "10:00" },
            { subject: "English", teacher: "Mr. Tariq", room: "Room 103", startTime: "10:30", endTime: "11:30" },
        ],
        Friday: [
            { subject: "Computer Science", teacher: "Mr. Bilal", room: "CS Lab", startTime: "08:00", endTime: "09:00" },
            { subject: "Chemistry", teacher: "Ms. Amina", room: "Lab 2", startTime: "09:00", endTime: "10:00" },
        ],
        Saturday: [],
    },
    "Sara Ali": {
        Monday: [
            { subject: "Mathematics", teacher: "Ms. Nadia", room: "Room 201", startTime: "08:00", endTime: "09:00" },
            { subject: "English", teacher: "Mr. Omer", room: "Room 202", startTime: "09:00", endTime: "10:00" },
        ],
        Tuesday: [
            { subject: "Islamiat", teacher: "Mr. Hassan", room: "Room 204", startTime: "08:00", endTime: "09:00" },
            { subject: "Urdu", teacher: "Ms. Sana", room: "Room 203", startTime: "09:00", endTime: "10:00" },
        ],
        Wednesday: [
            { subject: "Mathematics", teacher: "Ms. Nadia", room: "Room 201", startTime: "08:00", endTime: "09:00" },
        ],
        Thursday: [
            { subject: "English", teacher: "Mr. Omer", room: "Room 202", startTime: "09:00", endTime: "10:00" },
        ],
        Friday: [
            { subject: "Islamiat", teacher: "Mr. Hassan", room: "Room 204", startTime: "08:00", endTime: "09:00" },
        ],
        Saturday: [],
    },
}

export default function ParentTimetablePage() {
    const [selectedChild, setSelectedChild] = useState("Ahmed Ali")

    const schedule = MOCK_TIMETABLE[selectedChild] || {}

    const allSlots = Array.from(
        new Set(
            Object.values(schedule)
                .flat()
                .map((s) => `${s.startTime} - ${s.endTime}`)
        )
    ).sort()

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName="Parent User" userRole="Parent">
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

                {/* Timetable Grid */}
                <AnimatedWrapper delay={0.2}>
                    <Card className="glass-panel overflow-hidden border-border/50">
                        <CardHeader>
                            <CardTitle className="heading-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                {selectedChild} — Weekly Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                            <TableHead className="w-[120px] font-semibold">Time</TableHead>
                                            {DAYS_OF_WEEK.map((day) => (
                                                <TableHead key={day} className="min-w-[150px] text-center font-semibold">
                                                    {day}
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
                                                        const cls = schedule[day]?.find(
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
                                                                    <div className="mt-1 text-xs text-muted-foreground font-medium">{cls.teacher}</div>
                                                                    <div className="mt-0.5 text-xs text-muted-foreground/60">{cls.room}</div>
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
                                                    No schedule data found.
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
