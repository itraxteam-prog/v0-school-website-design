"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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

export default function AnalyticsPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Analytics</h1>
          <p className="text-sm text-muted-foreground">Detailed institutional analytics and insights.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Label>Date Range</Label>
            <Select defaultValue="6m">
              <SelectTrigger className="h-11 w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last 1 Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last 1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Full Width Charts */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">Attendance Trends</h2>
            </div>
            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder - Line chart showing daily attendance trends</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-serif text-base font-semibold text-foreground">Grade Distribution</h2>
              </div>
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart Placeholder - Donut chart showing grade distribution</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-serif text-base font-semibold text-foreground">Enrollment Statistics</h2>
              </div>
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart Placeholder - Bar chart showing enrollment by grade</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">Subject-wise Performance</h2>
            </div>
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder - Grouped bar chart comparing subject performance across grades</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
