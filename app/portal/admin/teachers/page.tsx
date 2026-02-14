"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, GraduationCap, Users, School, BarChart3, FileBarChart, Settings, Search } from "lucide-react"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
]

const teachers = [
  { name: "Mr. Usman Sheikh", department: "Mathematics", qualification: "M.Sc.", rating: "4.8/5", classes: 3, status: "Active" },
  { name: "Dr. Ayesha Siddiqui", department: "Physics", qualification: "Ph.D.", rating: "4.9/5", classes: 4, status: "Active" },
  { name: "Ms. Nadia Jamil", department: "English", qualification: "M.A.", rating: "4.7/5", classes: 3, status: "Active" },
  { name: "Mr. Bilal Ahmed", department: "Computer Science", qualification: "M.S.", rating: "4.6/5", classes: 4, status: "Active" },
  { name: "Dr. Zainab Rizvi", department: "Chemistry", qualification: "Ph.D.", rating: "4.8/5", classes: 3, status: "Active" },
  { name: "Ms. Hira Farooq", department: "Biology", qualification: "M.Phil.", rating: "4.5/5", classes: 2, status: "Active" },
  { name: "Mr. Tariq Mehmood", department: "Urdu", qualification: "M.A.", rating: "4.4/5", classes: 3, status: "On Leave" },
]

export default function AdminTeachersPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Teachers</h1>
          <p className="text-sm text-muted-foreground">Faculty directory and performance.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search teachers..." className="h-11 pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-full sm:w-48"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Sciences</SelectItem>
              <SelectItem value="languages">Languages</SelectItem>
              <SelectItem value="cs">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Name</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Department</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Qualification</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Rating</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Classes</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => (
                    <tr key={t.name} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{t.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{t.department}</td>
                      <td className="px-5 py-3 text-muted-foreground">{t.qualification}</td>
                      <td className="px-5 py-3 font-semibold text-primary">{t.rating}</td>
                      <td className="px-5 py-3 text-muted-foreground">{t.classes}</td>
                      <td className="px-5 py-3">
                        <Badge className={t.status === "Active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}>
                          {t.status}
                        </Badge>
                      </td>
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
