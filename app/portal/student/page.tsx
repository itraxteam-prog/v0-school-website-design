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

const summaryCards = [
  { label: "Overall GPA", value: "3.75", sub: "out of 4.0", color: "text-primary" },
  { label: "Attendance", value: "94%", sub: "this semester", color: "text-primary" },
  { label: "Upcoming Assignments", value: "5", sub: "due this week", color: "text-foreground" },
  { label: "Pending Fees", value: "PKR 0", sub: "all cleared", color: "text-foreground" },
]

const grades = [
  { subject: "Mathematics", grade: "A", marks: "92/100" },
  { subject: "Physics", grade: "A-", marks: "87/100" },
  { subject: "English", grade: "A", marks: "90/100" },
  { subject: "Chemistry", grade: "B+", marks: "84/100" },
  { subject: "Computer Science", grade: "A+", marks: "96/100" },
]

const events = [
  { title: "Science Fair", date: "Feb 20, 2026", type: "Event" },
  { title: "Math Quiz - Chapter 5", date: "Feb 18, 2026", type: "Assessment" },
  { title: "Parent-Teacher Meeting", date: "Feb 25, 2026", type: "Meeting" },
  { title: "Sports Day", date: "Mar 5, 2026", type: "Event" },
]

export default function StudentDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-6">
        {/* Welcome */}
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Welcome back, Ahmed</h1>
          <p className="text-sm text-muted-foreground">Here is your academic overview for today.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label} className="border-border">
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Grade Overview */}
          <div className="lg:col-span-3">
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="font-serif text-base font-semibold text-foreground">Recent Grades</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-5 py-3 font-semibold text-foreground">Subject</th>
                        <th className="px-5 py-3 font-semibold text-foreground">Grade</th>
                        <th className="px-5 py-3 font-semibold text-foreground">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g, i) => (
                        <tr key={g.subject} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "" : "bg-muted/50"}`}>
                          <td className="px-5 py-3 font-medium text-foreground">{g.subject}</td>
                          <td className="px-5 py-3 font-semibold text-primary">{g.grade}</td>
                          <td className="px-5 py-3 text-muted-foreground">{g.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="font-serif text-base font-semibold text-foreground">Upcoming Events</h2>
                </div>
                <div className="flex flex-col">
                  {events.map((e, i) => (
                    <div key={e.title} className={`flex items-start gap-3 px-5 py-3 ${i < events.length - 1 ? "border-b border-border" : ""}`}>
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                        <CalendarCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{e.date} &middot; {e.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
