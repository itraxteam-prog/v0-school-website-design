"use client"

import { useEffect, useState } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User, ClipboardList, PlusCircle, TrendingUp, UserCheck, FileText, ShieldCheck, Loader2 } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClassPerformanceChart } from "@/components/portal/teacher-charts"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TeacherDashboard() {
  const { user, loading: authLoading } = useRequireAuth(['teacher']);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/teacher/dashboard`);
        if (res.ok) {
          const dashboardData = await res.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Teacher"} userRole="teacher">
      <div className="flex flex-col gap-8 pb-8">

        {/* Welcome Section */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-1">
            <h1 className="heading-1 text-burgundy-gradient">Welcome back, {user?.name?.split(' ')[1] || 'Teacher'}</h1>
            <p className="text-sm text-muted-foreground">Here is your teaching overview for today.</p>
          </div>
        </AnimatedWrapper>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Classes"
            value={data?.stats?.totalClasses ?? 0}
            icon={Users}
            loading={loading}
            trend="Active this semester"
            trendColor="text-muted-foreground"
          />
          <StatCard
            title="Total Students"
            value={data?.stats?.totalStudents ?? 0}
            icon={UserCheck}
            loading={loading}
            trend="Across all classes"
            trendColor="text-muted-foreground"
          />
          <StatCard
            title="Attendance Today"
            value={data?.stats?.attendanceToday ?? "0%"}
            icon={CalendarCheck}
            loading={loading}
            trend="Average attendance"
            trendColor="text-green-600"
          />
          <StatCard
            title="Pending Grades"
            value={data?.stats?.pendingGrades ?? 0}
            icon={FileText}
            loading={loading}
            trend="Assignments to grade"
            trendColor="text-primary"
            highlight
          />
        </div>

        {/* Quick Actions */}
        <AnimatedWrapper delay={0.1}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader>
              <CardTitle className="heading-3">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  Mark Attendance
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-2">
                  <BookMarked className="h-4 w-4" />
                  Add Grades
                </Button>
                <Button variant="outline" className="border-border hover:bg-muted flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Column - Charts & Schedule */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Class Performance Chart */}
            <AnimatedWrapper delay={0.2}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Class Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                  ) : (
                    <ClassPerformanceChart />
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Today's Schedule Table */}
            <AnimatedWrapper delay={0.3}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                          <TableHead className="w-[140px]">Time</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead className="hidden sm:table-cell">Room</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i} className="border-border/50">
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                              <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                            </TableRow>
                          ))
                        ) : (
                        ): data?.schedule && data.schedule.length > 0 ? (
                          data.schedule.map((item: any, i: number) => (
                        <TableRow
                          key={i}
                          className={`group border-border/50 transition-colors ${item.class === "Free Period"
                            ? "bg-muted/30 hover:bg-muted/40"
                            : "hover:bg-primary/5"
                            }`}
                        >
                          <TableCell className="font-medium text-sm">{item.time}</TableCell>
                          <TableCell className={item.class === "Free Period" ? "text-muted-foreground italic" : "font-medium"}>
                            {item.class}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{item.subject}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{item.room}</TableCell>
                        </TableRow>
                        ))
                        ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No classes scheduled for today.
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

          {/* Right Column - Side Panel */}
          <div className="flex flex-col gap-6 lg:col-span-1">

            {/* Assigned Classes */}
            <AnimatedWrapper delay={0.4} className="h-full">
              <Card className="glass-panel h-full border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3">My Classes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-3 rounded-xl border border-border/50 p-4">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))
                  ) : (
                    data?.classes?.map((cls: any) => (
                      <div
                        key={cls.name}
                        className="flex flex-col gap-2 rounded-xl border border-transparent p-4 transition-all hover:border-border/50 hover:bg-muted/30 hover:shadow-sm cursor-pointer"
                        onClick={() => window.location.href = '/portal/teacher/classes'}
                      >
                        <h3 className="font-semibold text-foreground">{cls.name}</h3>
                        <p className="text-sm text-primary font-medium">{cls.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs px-2 py-0.5 border-primary/20 text-muted-foreground">
                            {cls.students} students
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Pending Tasks */}
            <AnimatedWrapper delay={0.5}>
              <Card className="glass-panel border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Pending Tasks
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
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <BookMarked className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Grade Assignments</p>
                          <p className="text-xs text-muted-foreground mt-0.5">12 pending submissions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <CalendarCheck className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Update Attendance</p>
                          <p className="text-xs text-muted-foreground mt-0.5">For today's classes</p>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-2 bg-primary text-white hover:bg-primary/90"
                        size="sm"
                        onClick={() => window.location.href = '/portal/teacher/gradebook'}
                      >
                        View All Tasks
                      </Button>
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
