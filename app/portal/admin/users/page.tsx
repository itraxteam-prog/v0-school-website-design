"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, GraduationCap, Users, School, BarChart3, FileBarChart, Settings, Search, Plus, Pencil, Trash2 } from "lucide-react"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
]

const users = [
  { name: "Dr. Ahmad Raza", email: "ahmad.raza@pioneershigh.edu", role: "Admin", status: "Active" },
  { name: "Mr. Usman Sheikh", email: "usman.sheikh@pioneershigh.edu", role: "Teacher", status: "Active" },
  { name: "Dr. Ayesha Siddiqui", email: "ayesha.siddiqui@pioneershigh.edu", role: "Teacher", status: "Active" },
  { name: "Ahmed Khan", email: "ahmed.khan@pioneershigh.edu", role: "Student", status: "Active" },
  { name: "Sara Ali", email: "sara.ali@pioneershigh.edu", role: "Student", status: "Active" },
  { name: "Omar Farooq", email: "omar.farooq@pioneershigh.edu", role: "Student", status: "Inactive" },
  { name: "Ms. Nadia Jamil", email: "nadia.jamil@pioneershigh.edu", role: "Teacher", status: "Active" },
  { name: "Mr. Tariq Mehmood", email: "tariq.mehmood@pioneershigh.edu", role: "Teacher", status: "Inactive" },
]

const roleBadge: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Teacher: "bg-blue-50 text-blue-700",
  Student: "bg-green-50 text-green-700",
}

export default function UserManagementPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage system users and access roles.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="h-11 pl-9" />
          </div>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Name</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Email</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Role</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Status</th>
                    <th className="px-5 py-3 text-center font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.email} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{u.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3">
                        <Badge className={roleBadge[u.role] || "bg-muted text-muted-foreground"}>{u.role}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={u.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>{u.status}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" disabled>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">All action buttons are visual mockups only. No data will be modified.</p>
      </div>
    </DashboardLayout>
  )
}
