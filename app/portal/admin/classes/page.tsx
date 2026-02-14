"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
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

const classes = [
  { name: "Grade 10-A", teacher: "Mr. Usman Sheikh", students: 32, avgGrade: "B+", room: "Room 201" },
  { name: "Grade 10-B", teacher: "Dr. Ayesha Siddiqui", students: 30, avgGrade: "B", room: "Room 202" },
  { name: "Grade 9-A", teacher: "Ms. Nadia Jamil", students: 35, avgGrade: "B+", room: "Room 301" },
  { name: "Grade 9-B", teacher: "Mr. Bilal Ahmed", students: 33, avgGrade: "B", room: "Room 302" },
  { name: "Grade 8-A", teacher: "Dr. Zainab Rizvi", students: 30, avgGrade: "A-", room: "Room 101" },
  { name: "Grade 8-B", teacher: "Ms. Hira Farooq", students: 28, avgGrade: "B+", room: "Room 102" },
]

export default function AdminClassesPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Classes</h1>
          <p className="text-sm text-muted-foreground">Overview of all class sections and assignments.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card key={c.name} className="border-border transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="p-5">
                <h3 className="font-serif text-base font-semibold text-foreground">{c.name}</h3>
                <p className="text-sm text-primary">{c.teacher}</p>
                <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Students</span><span className="font-medium text-foreground">{c.students}</span></div>
                  <div className="flex justify-between"><span>Avg. Grade</span><span className="font-medium text-foreground">{c.avgGrade}</span></div>
                  <div className="flex justify-between"><span>Room</span><span className="font-medium text-foreground">{c.room}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
