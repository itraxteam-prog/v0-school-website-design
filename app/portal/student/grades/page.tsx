"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
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

const terms = ["Fall 2025", "Spring 2026"]

const gradeData = [
  { subject: "Mathematics", midterm: 88, final: 92, grade: "A", gpa: "4.0" },
  { subject: "Physics", midterm: 82, final: 87, grade: "A-", gpa: "3.7" },
  { subject: "English", midterm: 90, final: 90, grade: "A", gpa: "4.0" },
  { subject: "Chemistry", midterm: 78, final: 84, grade: "B+", gpa: "3.3" },
  { subject: "Computer Science", midterm: 95, final: 96, grade: "A+", gpa: "4.0" },
  { subject: "Urdu", midterm: 80, final: 85, grade: "A-", gpa: "3.7" },
  { subject: "Islamiat", midterm: 88, final: 91, grade: "A", gpa: "4.0" },
]

export default function GradesPage() {
  const [activeTerm, setActiveTerm] = useState(terms[1])

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">My Grades</h1>
          <p className="text-sm text-muted-foreground">View your academic performance by semester.</p>
        </div>

        {/* Term Tabs */}
        <div className="flex gap-2">
          {terms.map((term) => (
            <button
              key={term}
              onClick={() => setActiveTerm(term)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTerm === term
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Grade Cards (Mobile) */}
        <div className="flex flex-col gap-3 sm:hidden">
          {gradeData.map((g) => (
            <Card key={g.subject} className="border-border">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{g.subject}</p>
                  <p className="text-xs text-muted-foreground">Midterm: {g.midterm} | Final: {g.final}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{g.grade}</p>
                  <p className="text-xs text-muted-foreground">GPA: {g.gpa}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grade Table (Tablet+) */}
        <Card className="hidden border-border sm:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Subject</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Midterm</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Final</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Grade</th>
                    <th className="px-5 py-3 font-semibold text-foreground">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeData.map((g, i) => (
                    <tr key={g.subject} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{g.subject}</td>
                      <td className="px-5 py-3 text-muted-foreground">{g.midterm}</td>
                      <td className="px-5 py-3 text-muted-foreground">{g.final}</td>
                      <td className="px-5 py-3 font-semibold text-primary">{g.grade}</td>
                      <td className="px-5 py-3 text-muted-foreground">{g.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart Placeholder */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">Performance Trend</h2>
            </div>
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder - Performance trend line chart</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
