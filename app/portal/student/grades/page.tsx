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
import dynamic from "next/dynamic"
const PerformanceTrendChart = dynamic(() => import("@/components/portal/dashboard-charts").then(mod => mod.PerformanceTrendChart), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"

import { STUDENT_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

// Internal API base path
const API_BASE = "/api";

const terms = ["Fall 2025", "Spring 2026", "Fall 2026"]
const subjects = ["All Subjects", "Mathematics", "Physics", "English", "Chemistry", "Computer Science", "Urdu", "Islamiat"]

// Mock Data


export default function GradesPage() {
  const [activeTerm, setActiveTerm] = useState("All Terms")
  const [activeSubject, setActiveSubject] = useState("All Subjects")
  const [loading, setLoading] = useState(true)
  const [grades, setGrades] = useState<any[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(`${API_BASE}/student/grades`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API ERROR [fetchStudentGrades]:", res.status, errorText);
          throw new Error(errorText || "Failed to fetch grades");
        }
        const result = await res.json();
        setGrades(result.data || []);
      } catch (error: any) {
        console.error("Failed to fetch grades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [])

  const filteredGrades = grades.filter(g =>
    (activeTerm === "All Terms" || g.term === activeTerm) &&
    (activeSubject === "All Subjects" || g.subject === activeSubject)
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName={session?.user?.name || "Student"} userRole="Student">
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
                  <SelectItem value="All Terms">All Terms</SelectItem>
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

              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
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
                <PerformanceTrendChart data={[]} />

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
                      <TableHead>Exam/Term</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Marks</TableHead>
                      <TableHead className="text-right">Total</TableHead>
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
                      filteredGrades.map((grade, index) => (
                        <TableRow key={index} className="group border-border/50 transition-colors hover:bg-primary/5">
                          <TableCell className="font-medium">{grade.subject}</TableCell>
                          <TableCell className="text-muted-foreground">{grade.term || grade.type}</TableCell>
                          <TableCell className="text-muted-foreground">{grade.examDate ? new Date(grade.examDate).toLocaleDateString() : '-'}</TableCell>
                          <TableCell className="text-right font-medium">{grade.marks}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{grade.total}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={grade.grade?.startsWith("A") ? "default" : "secondary"} className="font-bold w-10 justify-center">
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
