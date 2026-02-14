"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

const classesData = [
  {
    name: "Grade 10-A",
    subject: "Mathematics",
    students: [
      { name: "Ahmed Khan", rollNo: "2025-0142", gpa: "3.75" },
      { name: "Sara Ali", rollNo: "2025-0143", gpa: "3.90" },
      { name: "Hamza Butt", rollNo: "2025-0144", gpa: "3.40" },
      { name: "Fatima Noor", rollNo: "2025-0145", gpa: "3.85" },
      { name: "Bilal Shah", rollNo: "2025-0146", gpa: "3.20" },
    ],
  },
  {
    name: "Grade 10-B",
    subject: "Mathematics",
    students: [
      { name: "Zain Malik", rollNo: "2025-0201", gpa: "3.60" },
      { name: "Aisha Rehman", rollNo: "2025-0202", gpa: "3.95" },
      { name: "Omar Farooq", rollNo: "2025-0203", gpa: "3.30" },
      { name: "Hira Jamil", rollNo: "2025-0204", gpa: "3.70" },
    ],
  },
  {
    name: "Grade 9-A",
    subject: "Mathematics",
    students: [
      { name: "Ali Raza", rollNo: "2025-0301", gpa: "3.80" },
      { name: "Maryam Iqbal", rollNo: "2025-0302", gpa: "3.55" },
      { name: "Usman Tariq", rollNo: "2025-0303", gpa: "3.45" },
    ],
  },
]

export default function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const activeClass = classesData.find((c) => c.name === selectedClass)

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="Teacher">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">My Classes</h1>
          <p className="text-sm text-muted-foreground">View class details and student lists.</p>
        </div>

        {!selectedClass ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classesData.map((c) => (
              <Card
                key={c.name}
                className="cursor-pointer border-border transition-all hover:border-primary/20 hover:shadow-md"
                onClick={() => setSelectedClass(c.name)}
              >
                <CardContent className="p-5">
                  <h3 className="font-serif text-base font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-primary">{c.subject}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{c.students.length} students</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <Button variant="ghost" className="w-fit gap-2 text-muted-foreground" onClick={() => setSelectedClass(null)}>
              <ArrowLeft className="h-4 w-4" /> Back to Classes
            </Button>
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="font-serif text-base font-semibold text-foreground">{activeClass?.name} - {activeClass?.subject}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-5 py-3 font-semibold text-foreground">Student Name</th>
                        <th className="px-5 py-3 font-semibold text-foreground">Roll No.</th>
                        <th className="px-5 py-3 font-semibold text-foreground">GPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeClass?.students.map((s, i) => (
                        <tr key={s.rollNo} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 !== 0 ? "bg-muted/50" : ""}`}>
                          <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                          <td className="px-5 py-3 text-muted-foreground">{s.rollNo}</td>
                          <td className="px-5 py-3 text-muted-foreground">{s.gpa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
