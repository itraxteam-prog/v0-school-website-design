"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User, CheckCircle2, XCircle, AlertCircle, ShieldCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AttendanceDistributionChart } from "@/components/portal/attendance-charts"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

const months = [
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Mock Data - Calendar for different months
type AttendanceStatus = "present" | "absent" | "late" | "none"

const monthlyCalendars: Record<string, { day: number; status: AttendanceStatus }[][]> = {
  "February 2026": [
    [
      { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 1, status: "present" },
    ],
    [
      { day: 2, status: "present" }, { day: 3, status: "present" }, { day: 4, status: "late" }, { day: 5, status: "present" }, { day: 6, status: "present" }, { day: 7, status: "present" },
    ],
    [
      { day: 8, status: "present" }, { day: 9, status: "absent" }, { day: 10, status: "present" }, { day: 11, status: "present" }, { day: 12, status: "present" }, { day: 13, status: "present" },
    ],
    [
      { day: 14, status: "present" }, { day: 15, status: "present" }, { day: 16, status: "late" }, { day: 17, status: "present" }, { day: 18, status: "present" }, { day: 19, status: "present" },
    ],
    [
      { day: 20, status: "present" }, { day: 21, status: "present" }, { day: 22, status: "present" }, { day: 23, status: "late" }, { day: 24, status: "present" }, { day: 25, status: "present" },
    ],
    [
      { day: 26, status: "present" }, { day: 27, status: "present" }, { day: 28, status: "present" }, { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 0, status: "none" },
    ],
  ],
  "January 2026": [
    [
      { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 1, status: "present" }, { day: 2, status: "present" }, { day: 3, status: "present" }, { day: 4, status: "present" },
    ],
    [
      { day: 5, status: "present" }, { day: 6, status: "present" }, { day: 7, status: "late" }, { day: 8, status: "present" }, { day: 9, status: "present" }, { day: 10, status: "present" },
    ],
    [
      { day: 11, status: "present" }, { day: 12, status: "present" }, { day: 13, status: "present" }, { day: 14, status: "absent" }, { day: 15, status: "present" }, { day: 16, status: "present" },
    ],
    [
      { day: 17, status: "present" }, { day: 18, status: "present" }, { day: 19, status: "present" }, { day: 20, status: "late" }, { day: 21, status: "present" }, { day: 22, status: "present" },
    ],
    [
      { day: 23, status: "present" }, { day: 24, status: "present" }, { day: 25, status: "present" }, { day: 26, status: "present" }, { day: 27, status: "present" }, { day: 28, status: "present" },
    ],
    [
      { day: 29, status: "present" }, { day: 30, status: "late" }, { day: 31, status: "present" }, { day: 0, status: "none" }, { day: 0, status: "none" }, { day: 0, status: "none" },
    ],
  ],
}

const statusColors = {
  present: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  late: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  none: "",
}

// Calculate attendance stats from calendar
function calculateStats(calendar: { day: number; status: AttendanceStatus }[][]) {
  let present = 0
  let absent = 0
  let late = 0

  calendar.forEach(week => {
    week.forEach(cell => {
      if (cell.status === "present") present++
      else if (cell.status === "absent") absent++
      else if (cell.status === "late") late++
    })
  })

  return { present, absent, late }
}

export default function AttendancePage() {
  const [activeMonth, setActiveMonth] = useState("February 2026")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [activeMonth])

  const currentCalendar = monthlyCalendars[activeMonth] || monthlyCalendars["February 2026"]
  const stats = calculateStats(currentCalendar)

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="student">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="heading-1 text-burgundy-gradient">Attendance</h1>
              <p className="text-sm text-muted-foreground">Track your attendance record and statistics.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={activeMonth} onValueChange={setActiveMonth}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Summary Cards */}
        <AnimatedWrapper delay={0.1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="glass-panel overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Present</p>
                    {loading ? (
                      <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                      <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
                    )}
                  </div>
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Absent</p>
                    {loading ? (
                      <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                      <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
                    )}
                  </div>
                  <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Late</p>
                    {loading ? (
                      <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                      <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.late}</p>
                    )}
                  </div>
                  <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedWrapper>

        {/* Calendar and Chart Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Calendar */}
          <AnimatedWrapper delay={0.2}>
            <Card className="glass-panel overflow-hidden border-border/50">
              <CardHeader>
                <CardTitle className="heading-3 flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  {activeMonth}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[320px] w-full rounded-xl" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[360px]">
                      <thead>
                        <tr>
                          {days.map((d) => (
                            <th key={d} className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentCalendar.map((week, wi) => (
                          <tr key={wi}>
                            {week.map((cell, ci) => (
                              <td key={ci} className="p-1 text-center">
                                {cell.day > 0 ? (
                                  <div className={`flex h-12 w-full items-center justify-center rounded-md text-sm font-medium transition-all hover:scale-105 ${statusColors[cell.status]}`}>
                                    {cell.day}
                                  </div>
                                ) : null}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Legend */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border/50 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900/30" />
                        <span className="text-xs text-muted-foreground">Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-amber-100 dark:bg-amber-900/30" />
                        <span className="text-xs text-muted-foreground">Late</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/30" />
                        <span className="text-xs text-muted-foreground">Absent</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>

          {/* Attendance Distribution Chart */}
          <AnimatedWrapper delay={0.3}>
            <Card className="glass-panel overflow-hidden border-border/50">
              <CardHeader>
                <CardTitle className="heading-3">Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[320px] w-full rounded-xl" />
                ) : (
                  <AttendanceDistributionChart data={stats} />
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>
        </div>

      </div>
    </AppLayout>
  )
}
