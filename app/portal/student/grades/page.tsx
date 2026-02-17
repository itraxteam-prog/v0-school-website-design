"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User, TrendingUp, Download, Filter, ShieldCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { PerformanceTrendChart } from "@/components/portal/dashboard-charts"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

const terms = ["Fall 2025", "Spring 2026", "Fall 2026"]
const subjects = ["All Subjects", "Mathematics", "Physics", "English", "Chemistry", "Computer Science", "Urdu", "Islamiat"]

// Mock Data
const allGrades = [
  { subject: "Mathematics", term: "Spring 2026", term1: "85", term2: "88", term3: "-", final: "-", grade: "A" },
  { subject: "Physics", term: "Spring 2026", term1: "82", term2: "86", term3: "-", final: "-", grade: "A-" },
  { subject: "English", term: "Spring 2026", term1: "90", term2: "92", term3: "-", final: "-", grade: "A+" },
  { subject: "Chemistry", term: "Spring 2026", term1: "78", term2: "84", term3: "-", final: "-", grade: "B+" },
  { subject: "Computer Science", term: "Spring 2026", term1: "95", term2: "98", term3: "-", final: "-", grade: "A+" },
  { subject: "Urdu", term: "Spring 2026", term1: "80", term2: "85", term3: "-", final: "-", grade: "A-" },
  { subject: "Islamiat", term: "Spring 2026", term1: "88", term2: "91", term3: "-", final: "-", grade: "A" },
  // Fall 2025 data
  { subject: "Mathematics", term: "Fall 2025", term1: "82", term2: "85", term3: "88", final: "90", grade: "A" },
  { subject: "Physics", term: "Fall 2025", term1: "78", term2: "80", term3: "84", final: "86", grade: "B+" },
]

export default function GradesPage() {
  const [activeTerm, setActiveTerm] = useState("Spring 2026")
  const [activeSubject, setActiveSubject] = useState("All Subjects")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [activeTerm, activeSubject])

  const filteredGrades = allGrades.filter(g =>
    (g.term === activeTerm) &&
    (activeSubject === "All Subjects" || g.subject === activeSubject)
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="heading-1 text-burgundy-gradient">My Grades</h1>
              <p className="text-sm text-muted-foreground">Detailed academic performance report.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={activeTerm} onValueChange={setActiveTerm}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map(term => <SelectItem key={term} value={term}>{term}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={activeSubject} onValueChange={setActiveSubject}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Filter Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Charts Section */}
        <AnimatedWrapper delay={0.2}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="heading-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Trend - {activeTerm}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <PerformanceTrendChart />
              )}
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Grades Table */}
        <AnimatedWrapper delay={0.3}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader>
              <CardTitle className="heading-3">Detailed Grades</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="w-[180px]">Subject</TableHead>
                      <TableHead className="text-center">Term 1</TableHead>
                      <TableHead className="text-center">Term 2</TableHead>
                      <TableHead className="text-center">Term 3</TableHead>
                      <TableHead className="text-center">Final</TableHead>
                      <TableHead className="text-right">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-border/50">
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="mx-auto h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="mx-auto h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="mx-auto h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="mx-auto h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="ml-auto h-6 w-8 rounded" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredGrades.length > 0 ? (
                      filteredGrades.map((grade) => (
                        <TableRow key={grade.subject} className="group border-border/50 transition-colors hover:bg-primary/5">
                          <TableCell className="font-medium">{grade.subject}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{grade.term1}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{grade.term2}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{grade.term3}</TableCell>
                          <TableCell className="text-center font-medium text-foreground">{grade.final}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={grade.grade.startsWith("A") ? "default" : "secondary"} className="font-bold w-10 justify-center">
                              {grade.grade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No grades found for selected filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>
      </div>
    </AppLayout>
  )
}
