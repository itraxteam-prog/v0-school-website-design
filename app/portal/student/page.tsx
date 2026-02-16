"use client"

import { useEffect, useState } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User, TrendingUp, Book, AlertCircle, ShieldCheck } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { PerformanceTrendChart, SubjectComparisonChart } from "@/components/portal/dashboard-charts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

export default function StudentDashboard() {
  const { user, loading: authLoading } = useRequireAuth(['student']);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (authLoading) {
    return null;
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-8 pb-8">

        {/* Welcome Section */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-1">
            <h1 className="heading-1 text-burgundy-gradient">Welcome back, Ahmed</h1>
            <p className="text-sm text-muted-foreground">Here is your academic overview for today.</p>
          </div>
        </AnimatedWrapper>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall Performance"
            value="92%"
            icon={TrendingUp}
            loading={loading}
            trend="+2.5% from last term"
            trendColor="text-green-600"
          />
          <StatCard
            title="Attendance"
            value="94%"
            icon={CalendarCheck}
            loading={loading}
            trend="Needs improvement"
            trendColor="text-amber-600"
          />
          <StatCard
            title="Total Subjects"
            value="8"
            icon={Book}
            loading={loading}
            trend="All active"
            trendColor="text-muted-foreground"
          />
          <StatCard
            title="Assignments"
            value="3"
            icon={AlertCircle}
            loading={loading}
            trend="Due this week"
            trendColor="text-primary"
            highlight
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Column - Charts & Grades */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Performance Chart */}
            <AnimatedWrapper delay={0.2}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Trend
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

            {/* Subject Comparison Chart */}
            <AnimatedWrapper delay={0.3}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Subject Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                  ) : (
                    <SubjectComparisonChart />
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Recent Grades Table */}
            <AnimatedWrapper delay={0.4}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3">Recent Grades</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                          <TableHead className="w-[180px]">Subject</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Marks</TableHead>
                          <TableHead className="text-right">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border/50">
                              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                              <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                              <TableCell><Skeleton className="ml-auto h-6 w-8 rounded" /></TableCell>
                            </TableRow>
                          ))
                        ) : (
                          // Mock Data
                          [
                            { sub: "Mathematics", type: "Quiz", date: "Feb 12", marks: "18/20", grade: "A" },
                            { sub: "Physics", type: "Lab", date: "Feb 10", marks: "9/10", grade: "A-" },
                            { sub: "English", type: "Essay", date: "Feb 08", marks: "22/25", grade: "B+" },
                            { sub: "Computer Sci", type: "Project", date: "Feb 05", marks: "48/50", grade: "A+" },
                            { sub: "Chemistry", type: "Quiz", date: "Feb 02", marks: "16/20", grade: "B" },
                          ].map((item) => (
                            <TableRow key={item.sub} className="group border-border/50 transition-colors hover:bg-primary/5">
                              <TableCell className="font-medium">{item.sub}</TableCell>
                              <TableCell className="text-muted-foreground">{item.type}</TableCell>
                              <TableCell className="text-muted-foreground">{item.date}</TableCell>
                              <TableCell className="text-right font-medium">{item.marks}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant={item.grade.startsWith("A") ? "default" : "secondary"} className="font-bold w-8 justify-center">
                                  {item.grade}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>

          </div>

          {/* Right Column - Side Panel */}
          <div className="flex flex-col gap-6 lg:col-span-1">

            {/* Upcoming Events */}
            <AnimatedWrapper delay={0.5} className="h-full">
              <Card className="glass-panel h-full border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      { title: "Science Fair", date: "Feb 20", type: "Event" },
                      { title: "Math Quiz", date: "Feb 18", type: "Exam" },
                      { title: "Sports Day", date: "Mar 05", type: "Event" },
                    ].map((evt) => (
                      <div key={evt.title} className="flex items-start gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-border/50 hover:bg-muted/30">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <CalendarCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{evt.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-primary/20 text-primary">{evt.type}</Badge>
                            <span className="text-xs text-muted-foreground">{evt.date}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Announcements */}
            <AnimatedWrapper delay={0.6}>
              <Card className="glass-panel border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <Megaphone className="h-4 w-4" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-20 w-full rounded-md" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Mid-Term Results Out!</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The results for the Spring 2026 mid-term examinations have been published. Please check your gradebook for details.
                      </p>
                      <Badge className="w-fit bg-primary text-white hover:bg-primary/90">Check Now</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

          </div>

        </div>
      </div>
    </AppLayout>
  )
}

function StatCard({ title, value, icon: Icon, loading, trend, trendColor, highlight = false }: any) {
  return (
    <AnimatedWrapper>
      <Card className={`glass-card border-border/50 ${highlight ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${highlight ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <Skeleton className="h-9 w-24 mb-1" />
            ) : (
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            )}
            {loading ? (
              <Skeleton className="h-4 w-32 mt-2" />
            ) : (
              <p className={`text-xs font-medium mt-1 ${trendColor}`}>
                {trend}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedWrapper>
  )
}
