"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User } from "lucide-react"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

const students = [
  { name: "Ahmed Khan", quiz1: 18, quiz2: 17, midterm: 88, assignment: 24 },
  { name: "Sara Ali", quiz1: 20, quiz2: 19, midterm: 95, assignment: 25 },
  { name: "Hamza Butt", quiz1: 15, quiz2: 14, midterm: 78, assignment: 20 },
  { name: "Fatima Noor", quiz1: 19, quiz2: 18, midterm: 90, assignment: 23 },
  { name: "Bilal Shah", quiz1: 16, quiz2: 15, midterm: 75, assignment: 22 },
]

export default function GradebookPage() {
  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="Teacher">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Gradebook</h1>
          <p className="text-sm text-muted-foreground">View and manage student grades.</p>
        </div>

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
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Student</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Quiz 1 (20)</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Quiz 2 (20)</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Midterm (100)</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Assignment (25)</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => {
                    const total = s.quiz1 + s.quiz2 + s.midterm + s.assignment
                    return (
                      <tr key={s.name} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                        <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-flex h-8 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-sm font-medium text-primary">{s.quiz1}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-flex h-8 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-sm font-medium text-primary">{s.quiz2}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-flex h-8 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-sm font-medium text-primary">{s.midterm}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-flex h-8 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-sm font-medium text-primary">{s.assignment}</span>
                        </td>
                        <td className="px-5 py-3 text-center font-semibold text-foreground">{total}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Button className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto" disabled>
          Save Grades
        </Button>
        <p className="text-xs text-muted-foreground">This is a visual mockup. No data will be saved.</p>
      </div>
    </AppLayout>
  )
}
