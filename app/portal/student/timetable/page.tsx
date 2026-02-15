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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const periods = [
  { time: "8:00 - 8:45" },
  { time: "8:45 - 9:30" },
  { time: "9:45 - 10:30" },
  { time: "10:30 - 11:15" },
  { time: "11:30 - 12:15" },
  { time: "12:15 - 1:00" },
]

const subjectColors: Record<string, string> = {
  Mathematics: "bg-primary/10 text-primary border-primary/20",
  Physics: "bg-blue-50 text-blue-800 border-blue-200",
  English: "bg-green-50 text-green-800 border-green-200",
  Chemistry: "bg-amber-50 text-amber-800 border-amber-200",
  "Computer Science": "bg-indigo-50 text-indigo-800 border-indigo-200",
  Urdu: "bg-teal-50 text-teal-800 border-teal-200",
  Islamiat: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Break: "bg-muted text-muted-foreground border-border",
}

const schedule: Record<string, string[]> = {
  Monday: ["Mathematics", "Physics", "Break", "English", "Chemistry", "Computer Science"],
  Tuesday: ["English", "Mathematics", "Break", "Physics", "Urdu", "Islamiat"],
  Wednesday: ["Chemistry", "Computer Science", "Break", "Mathematics", "Physics", "English"],
  Thursday: ["Urdu", "Islamiat", "Break", "Computer Science", "Mathematics", "Chemistry"],
  Friday: ["Physics", "English", "Break", "Urdu", "Islamiat", "Mathematics"],
}

export default function TimetablePage() {
  const [mobileDay, setMobileDay] = useState("Monday")

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Timetable</h1>
          <p className="text-sm text-muted-foreground">Your weekly class schedule.</p>
        </div>

        {/* Mobile Day Selector */}
        <div className="flex gap-1 overflow-x-auto md:hidden">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setMobileDay(day)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${mobileDay === day ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Mobile Schedule */}
        <div className="flex flex-col gap-2 md:hidden">
          {periods.map((period, pi) => {
            const subject = schedule[mobileDay][pi]
            return (
              <Card key={pi} className={`border ${subjectColors[subject] || "border-border"}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold">{subject}</p>
                    <p className="text-xs opacity-70">{period.time}</p>
                  </div>
                  <p className="text-xs opacity-50">Period {pi + 1}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Desktop Schedule Grid */}
        <Card className="hidden border-border md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Time</th>
                    {daysOfWeek.map((day) => (
                      <th key={day} className="px-4 py-3 text-center font-semibold text-foreground">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, pi) => (
                    <tr key={pi} className="border-b border-border">
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground">{period.time}</td>
                      {daysOfWeek.map((day) => {
                        const subject = schedule[day][pi]
                        return (
                          <td key={day} className="px-2 py-2">
                            <div className={`rounded-md border px-3 py-2 text-center text-xs font-medium ${subjectColors[subject] || "border-border bg-muted text-muted-foreground"}`}>
                              {subject}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
