"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutDashboard, GraduationCap, Users, School, BarChart3, FileBarChart, Settings } from "lucide-react"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
]

const kpis = [
  { label: "Total Students", value: "1,240", change: "+45 this term" },
  { label: "Total Teachers", value: "68", change: "+3 this term" },
  { label: "Attendance Rate", value: "94.2%", change: "+1.3% vs last term" },
  { label: "Avg. Performance", value: "B+", change: "Stable" },
]

const teachers = [
  { name: "Mr. Usman Sheikh", department: "Mathematics", rating: "4.8/5", classes: 3 },
  { name: "Dr. Ayesha Siddiqui", department: "Physics", rating: "4.9/5", classes: 4 },
  { name: "Ms. Nadia Jamil", department: "English", rating: "4.7/5", classes: 3 },
  { name: "Mr. Bilal Ahmed", department: "Computer Science", rating: "4.6/5", classes: 4 },
  { name: "Dr. Zainab Rizvi", department: "Chemistry", rating: "4.8/5", classes: 3 },
]

const recentActivity = [
  { action: "New student enrolled", detail: "Hamza Ali - Grade 9-B", time: "2 hours ago" },
  { action: "Attendance submitted", detail: "Grade 10-A by Mr. Sheikh", time: "3 hours ago" },
  { action: "Grades updated", detail: "Grade 10-B Chemistry", time: "5 hours ago" },
  { action: "Fee payment received", detail: "Sara Ali - PKR 14,000", time: "6 hours ago" },
  { action: "New teacher onboarded", detail: "Ms. Hira Farooq - Biology", time: "1 day ago" },
]

export default function AdminDashboard() {
  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Institutional overview and management.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border-border">
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-primary">{kpi.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{kpi.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-serif text-base font-semibold text-foreground">Enrollment Trends</h2>
              </div>
              <div className="flex h-56 items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart Placeholder - Bar chart showing monthly enrollment</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-serif text-base font-semibold text-foreground">Performance Trends</h2>
              </div>
              <div className="flex h-56 items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart Placeholder - Line chart showing grade trends</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Teacher Performance */}
          <div className="lg:col-span-3">
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="font-serif text-base font-semibold text-foreground">Teacher Performance</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-5 py-3 font-semibold text-foreground">Name</th>
                        <th className="px-5 py-3 font-semibold text-foreground">Department</th>
                        <th className="px-5 py-3 font-semibold text-foreground">Rating</th>
                        <th className="px-5 py-3 font-semibold text-foreground">Classes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t, i) => (
                        <tr key={t.name} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                          <td className="px-5 py-3 font-medium text-foreground">{t.name}</td>
                          <td className="px-5 py-3 text-muted-foreground">{t.department}</td>
                          <td className="px-5 py-3 font-semibold text-primary">{t.rating}</td>
                          <td className="px-5 py-3 text-muted-foreground">{t.classes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="font-serif text-base font-semibold text-foreground">Recent Activity</h2>
                </div>
                <div className="flex flex-col">
                  {recentActivity.map((a, i) => (
                    <div key={i} className={`px-5 py-3 ${i < recentActivity.length - 1 ? "border-b border-border" : ""}`}>
                      <p className="text-sm font-medium text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">{a.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
