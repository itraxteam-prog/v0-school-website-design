"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User } from "lucide-react"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

const classes = [
  { name: "Grade 10-A", subject: "Mathematics", students: 32 },
  { name: "Grade 10-B", subject: "Mathematics", students: 30 },
  { name: "Grade 9-A", subject: "Mathematics", students: 35 },
]

const todaySchedule = [
  { time: "8:00 - 8:45", class: "Grade 10-A", subject: "Mathematics" },
  { time: "8:45 - 9:30", class: "Grade 10-B", subject: "Mathematics" },
  { time: "9:45 - 10:30", class: "Free Period", subject: "-" },
  { time: "10:30 - 11:15", class: "Grade 9-A", subject: "Mathematics" },
  { time: "11:30 - 12:15", class: "Free Period", subject: "-" },
  { time: "12:15 - 1:00", class: "Grade 10-A", subject: "Mathematics" },
]

export default function TeacherDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="Teacher">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Welcome, Mr. Sheikh</h1>
          <p className="text-sm text-muted-foreground">Here is your teaching overview for today.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Mark Attendance</Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Enter Grades</Button>
        </div>

        {/* Classes */}
        <div>
          <h2 className="mb-4 font-serif text-base font-semibold text-foreground">Assigned Classes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <Card key={c.name} className="border-border">
                <CardContent className="p-5">
                  <h3 className="font-serif text-base font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-primary">{c.subject}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{c.students} students</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">{"Today's Schedule"}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Time</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Class</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySchedule.map((s, i) => (
                    <tr key={i} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 text-xs font-medium text-muted-foreground">{s.time}</td>
                      <td className="px-5 py-3 font-medium text-foreground">{s.class}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
