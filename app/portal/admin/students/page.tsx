"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, GraduationCap, Users, School, BarChart3, FileBarChart, Settings, Search, ChevronLeft, ChevronRight } from "lucide-react"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
]

const allStudents = [
  { name: "Ahmed Khan", rollNo: "2025-0142", grade: "10-A", status: "Active", gpa: "3.75" },
  { name: "Sara Ali", rollNo: "2025-0143", grade: "10-A", status: "Active", gpa: "3.90" },
  { name: "Hamza Butt", rollNo: "2025-0144", grade: "10-A", status: "Active", gpa: "3.40" },
  { name: "Fatima Noor", rollNo: "2025-0145", grade: "10-B", status: "Active", gpa: "3.85" },
  { name: "Bilal Shah", rollNo: "2025-0146", grade: "10-B", status: "Active", gpa: "3.20" },
  { name: "Zain Malik", rollNo: "2025-0201", grade: "9-A", status: "Active", gpa: "3.60" },
  { name: "Aisha Rehman", rollNo: "2025-0202", grade: "9-A", status: "Active", gpa: "3.95" },
  { name: "Omar Farooq", rollNo: "2025-0203", grade: "9-B", status: "Inactive", gpa: "3.30" },
  { name: "Hira Jamil", rollNo: "2025-0204", grade: "9-B", status: "Active", gpa: "3.70" },
  { name: "Ali Raza", rollNo: "2025-0301", grade: "8-A", status: "Active", gpa: "3.80" },
]

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("")
  const filtered = allStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Students</h1>
          <p className="text-sm text-muted-foreground">Student directory and management.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or roll number..." className="h-11 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-full sm:w-40"><SelectValue placeholder="Grade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="9">Grade 9</SelectItem>
              <SelectItem value="8">Grade 8</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-5 py-3 font-semibold text-foreground">Name</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Roll No.</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Grade</th>
                    <th className="px-5 py-3 font-semibold text-foreground">GPA</th>
                    <th className="px-5 py-3 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.rollNo} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.rollNo}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.grade}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.gpa}</td>
                      <td className="px-5 py-3">
                        <Badge className={s.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">Showing 1-{filtered.length} of {allStudents.length} students</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary text-primary-foreground">1</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">2</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
