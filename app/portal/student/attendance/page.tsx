"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User, CheckCircle2, XCircle, AlertCircle, ShieldCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import dynamic from "next/dynamic"
const AttendanceDistributionChart = dynamic(() => import("@/components/portal/attendance-charts").then(mod => mod.AttendanceDistributionChart), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO } from "date-fns"

// Internal API base path
const API_BASE = "/api";

type AttendanceStatus = "present" | "absent" | "late" | "none";

const statusColors = {
  present: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  late: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  none: "",
}

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


// Helper to generate calendar days for a given month
function generateCalendar(monthStr: string, attendanceRecords: any[]) {
  const [monthName, yearStr] = monthStr.split(' ');
  const year = parseInt(yearStr);
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const startDate = startOfMonth(new Date(year, monthIndex));
  const endDate = endOfMonth(startDate);

  // Get all days in month
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Pad start with empty days (0) until Monday? (UI mocks Mon-Sat, usually start week on Mon or Sun)
  // The UI mock shows Mon, Tue... Sat. Where is Sunday?
  // The mock days header is: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].
  // It seems Sunday is excluded or ignored?
  // Let's assume Mon-Sat week.
  // If startDate is not Monday, add padding.

  // For simplicity, let's map the days to the grid.

  const calendar: { day: number; status: AttendanceStatus }[][] = [];
  let week: { day: number; status: AttendanceStatus }[] = [];

  // Add padding for start of month
  // getDay returns 0 for Sunday, 1 for Monday...
  let startDay = getDay(startDate); // 0 (Sun) - 6 (Sat)
  // Adjust for Monday start: Mon(1)->0 ... Sun(0)->6
  let adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  // Create initial padding
  for (let i = 0; i < adjustedStartDay; i++) {
    week.push({ day: 0, status: "none" });
  }

  days.forEach(day => {
    // Skip Sundays if UI doesn't track them?
    if (getDay(day) === 0) return;

    // Find status
    const record = attendanceRecords.find(r => isSameDay(parseISO(r.date), day));
    const status = record ? record.status : "none"; // Default to none if no record

    week.push({ day: day.getDate(), status: status as AttendanceStatus });

    if (week.length === 6) { // Mon-Sat = 6 columns?
      calendar.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    // Pad end
    while (week.length < 6) {
      week.push({ day: 0, status: "none" });
    }
    calendar.push(week);
  }

  return calendar;
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
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${API_BASE}/student/attendance`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API ERROR [fetchStudentAttendance]:", res.status, errorText);
          throw new Error(errorText || "Failed to fetch attendance");
        }
        const result = await res.json();
        setAttendanceRecords(result.data || []);
      } catch (error: any) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [])

  const currentCalendar = generateCalendar(activeMonth, attendanceRecords);
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
