"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User, Check, X as XIcon } from "lucide-react"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

const students = [
  { name: "Ahmed Khan", rollNo: "2025-0142" },
  { name: "Sara Ali", rollNo: "2025-0143" },
  { name: "Hamza Butt", rollNo: "2025-0144" },
  { name: "Fatima Noor", rollNo: "2025-0145" },
  { name: "Bilal Shah", rollNo: "2025-0146" },
  { name: "Zain Malik", rollNo: "2025-0147" },
  { name: "Aisha Rehman", rollNo: "2025-0148" },
]

export default function TeacherAttendancePage() {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map((s) => [s.rollNo, true]))
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="Teacher">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Mark Attendance</h1>
          <p className="text-sm text-muted-foreground">Record daily attendance for your classes.</p>
        </div>

        {/* Selectors */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Label>Class</Label>
            <Select defaultValue="10a">
              <SelectTrigger className="h-11 w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10a">Grade 10-A</SelectItem>
                <SelectItem value="10b">Grade 10-B</SelectItem>
                <SelectItem value="9a">Grade 9-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <input type="date" defaultValue="2026-02-14" className="flex h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
        </div>

        {/* Attendance Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Student</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Roll No.</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.rollNo} className={`border-b border-border ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.rollNo}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setAttendance((prev) => ({ ...prev, [s.rollNo]: true }))}
                            className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${attendance[s.rollNo] ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground hover:bg-green-50"}`}
                            aria-label="Mark present"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setAttendance((prev) => ({ ...prev, [s.rollNo]: false }))}
                            className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${!attendance[s.rollNo] ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground hover:bg-red-50"}`}
                            aria-label="Mark absent"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Button className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto" disabled>
          Submit Attendance
        </Button>
        <p className="text-xs text-muted-foreground">This is a visual mockup. No data will be submitted.</p>
      </div>
    </AppLayout>
  )
}
