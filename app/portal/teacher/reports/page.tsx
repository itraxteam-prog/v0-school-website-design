"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User, Download } from "lucide-react"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

const classSummary = [
  { className: "Grade 10-A", avgGrade: "B+", avgAttendance: "92%", topStudent: "Sara Ali" },
  { className: "Grade 10-B", avgGrade: "B", avgAttendance: "89%", topStudent: "Aisha Rehman" },
  { className: "Grade 9-A", avgGrade: "B+", avgAttendance: "94%", topStudent: "Ali Raza" },
]

export default function TeacherReportsPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="Teacher">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Reports</h1>
          <p className="text-sm text-muted-foreground">View class performance summaries and generate reports.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Label>Report Type</Label>
            <Select defaultValue="performance">
              <SelectTrigger className="h-11 w-full sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Class Performance</SelectItem>
                <SelectItem value="attendance">Attendance Summary</SelectItem>
                <SelectItem value="grades">Grade Distribution</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" disabled>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">Class Performance Overview</h2>
            </div>
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder - Bar chart showing class performance comparison</p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">Class Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Class</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Avg. Grade</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Avg. Attendance</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Top Student</th>
                  </tr>
                </thead>
                <tbody>
                  {classSummary.map((c, i) => (
                    <tr key={c.className} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{c.className}</td>
                      <td className="px-5 py-3 font-semibold text-primary">{c.avgGrade}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.avgAttendance}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.topStudent}</td>
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
