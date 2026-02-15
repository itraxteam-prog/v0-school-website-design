"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, GraduationCap, Users, School, BarChart3, FileBarChart, Settings, Download, Printer } from "lucide-react"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
]

export default function AdminReportsPage() {
  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Reports</h1>
          <p className="text-sm text-muted-foreground">Generate and export institutional reports.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Label>Report Type</Label>
            <Select defaultValue="academic">
              <SelectTrigger className="h-11 w-full sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic Performance</SelectItem>
                <SelectItem value="attendance">Attendance Summary</SelectItem>
                <SelectItem value="enrollment">Enrollment Report</SelectItem>
                <SelectItem value="financial">Fee Collection</SelectItem>
                <SelectItem value="teacher">Teacher Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Term</Label>
            <Select defaultValue="spring2026">
              <SelectTrigger className="h-11 w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="spring2026">Spring 2026</SelectItem>
                <SelectItem value="fall2025">Fall 2025</SelectItem>
                <SelectItem value="spring2025">Spring 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" disabled>
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-muted" disabled>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </div>

        {/* Report Preview */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-foreground">Report Preview</h2>
            </div>
            <div className="flex h-96 flex-col items-center justify-center gap-4 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileBarChart className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-serif text-base font-semibold text-foreground">Academic Performance Report</p>
                <p className="text-sm text-muted-foreground">Spring 2026 Term</p>
              </div>
              <p className="max-w-sm text-center text-xs text-muted-foreground">
                Report preview will appear here. Select the report type and term, then click Download or Print to generate the report.
              </p>
              <p className="text-[10px] text-muted-foreground">This is a visual mockup. No reports will be generated.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
