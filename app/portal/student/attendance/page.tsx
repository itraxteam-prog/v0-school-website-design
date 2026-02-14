"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User } from "lucide-react"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Generate mock calendar data
function generateCalendar() {
  const weeks: { day: number; status: "present" | "absent" | "late" | "none" }[][] = []
  let day = 1
  for (let w = 0; w < 5; w++) {
    const week: { day: number; status: "present" | "absent" | "late" | "none" }[] = []
    for (let d = 0; d < 6; d++) {
      if (day > 28) {
        week.push({ day: 0, status: "none" })
      } else {
        const rand = Math.random()
        const status = rand > 0.15 ? "present" : rand > 0.08 ? "late" : "absent"
        week.push({ day, status })
        day++
      }
    }
    weeks.push(week)
  }
  return weeks
}

const calendar = generateCalendar()

const statusColors = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-amber-100 text-amber-800",
  none: "",
}

export default function AttendancePage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Attendance</h1>
          <p className="text-sm text-muted-foreground">Your attendance record for February 2026.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-700">22</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">3</p>
              <p className="text-xs text-muted-foreground">Late</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">February 2026</h2>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[360px]">
                <thead>
                  <tr>
                    {days.map((d) => (
                      <th key={d} className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calendar.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((cell, ci) => (
                        <td key={ci} className="p-1 text-center">
                          {cell.day > 0 ? (
                            <div className={`flex h-10 w-full items-center justify-center rounded-md text-xs font-medium ${statusColors[cell.status]}`}>
                              {cell.day}
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-3">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-green-100" /><span className="text-xs text-muted-foreground">Present</span></div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber-100" /><span className="text-xs text-muted-foreground">Late</span></div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-red-100" /><span className="text-xs text-muted-foreground">Absent</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
