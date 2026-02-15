"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  School,
  BarChart3,
  FileBarChart,
  Settings,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
]

const enrollmentData = [
  { month: "Jan", students: 1100 },
  { month: "Feb", students: 1150 },
  { month: "Mar", students: 1180 },
  { month: "Apr", students: 1210 },
  { month: "May", students: 1230 },
  { month: "Jun", students: 1240 },
]

const performanceData = [
  { subject: "Math", avg: 85 },
  { subject: "Science", avg: 78 },
  { subject: "English", avg: 82 },
  { subject: "History", avg: 88 },
  { subject: "Physics", avg: 75 },
  { subject: "Comp Sci", avg: 92 },
]

const teacherPerformance = [
  { name: "Mr. Usman Sheikh", classes: 3, performance: "92%", attendance: "98%" },
  { name: "Dr. Ayesha Siddiqui", classes: 4, performance: "89%", attendance: "95%" },
  { name: "Ms. Nadia Jamil", classes: 3, performance: "94%", attendance: "97%" },
  { name: "Mr. Bilal Ahmed", classes: 4, performance: "87%", attendance: "96%" },
  { name: "Dr. Zainab Rizvi", classes: 3, performance: "91%", attendance: "99%" },
]

const recentActivity = [
  { id: 1, action: "New student enrolled", detail: "Hamza Ali - Grade 9-B", time: "2 hours ago", icon: GraduationCap },
  { id: 2, action: "Attendance submitted", detail: "Grade 10-A by Mr. Sheikh", time: "3 hours ago", icon: UserCheck },
  { id: 3, action: "Grades updated", detail: "Grade 10-B Chemistry", time: "5 hours ago", icon: FileBarChart },
  { id: 4, action: "Fee payment received", detail: "Sara Ali - PKR 14,000", time: "6 hours ago", icon: TrendingUp },
  { id: 5, action: "New teacher onboarded", detail: "Ms. Hira Farooq - Biology", time: "1 day ago", icon: Users },
  { id: 6, action: "Class schedule updated", detail: "Grade 11-C Room 204", time: "1 day ago", icon: Calendar },
]

const kpiStats = [
  { label: "Total Students", value: "1,240", change: "+45", icon: GraduationCap, trend: "up", color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Total Teachers", value: "68", change: "+3", icon: Users, trend: "up", color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Total Staff", value: "42", change: "+1", icon: UserCheck, trend: "up", color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Attendance", value: "94.2%", change: "+1.3%", icon: Calendar, trend: "up", color: "text-orange-600", bg: "bg-orange-100" },
  { label: "Performance", value: "85%", change: "+2%", icon: Award, trend: "up", color: "text-indigo-600", bg: "bg-indigo-100" },
  { label: "Active Classes", value: "48", change: "0", icon: School, trend: "neutral", color: "text-pink-600", bg: "bg-pink-100" },
]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive school performance and administration overview.</p>
        </header>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpiStats.map((kpi, i) => (
            <Card key={i} className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${kpi.bg}`}>
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-bold text-foreground">{kpi.value}</h3>
                        {kpi.change !== "0" && (
                          <span className={`text-[10px] font-bold ${kpi.trend === "up" ? "text-emerald-600" : "text-amber-600"} flex items-center`}>
                            {kpi.trend === "up" ? <ArrowUpRight className="h-2 w-2" /> : <ArrowDownRight className="h-2 w-2" />}
                            {kpi.change}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enrollment Trend */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-lg font-semibold">Enrollment Trend</CardTitle>
              <p className="text-xs text-muted-foreground">Student enrollment growth over the last 6 months</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[280px] w-full rounded-lg" />
              ) : (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 11 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 11 }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="var(--primary)" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-lg font-semibold">Average Performance by Subject</CardTitle>
              <p className="text-xs text-muted-foreground">Current academic session average scores (%)</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[280px] w-full rounded-lg" />
              ) : (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="subject" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 11 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 11 }} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--primary)" : "var(--primary-foreground)"} fillOpacity={index % 2 === 0 ? 0.9 : 0.6} stroke="var(--primary)" strokeWidth={index % 2 !== 0 ? 1 : 0} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Teacher Performance Table */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif text-lg font-semibold">Teacher Performance</CardTitle>
              <p className="text-xs text-muted-foreground">Detailed metrics for teaching staff</p>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="relative overflow-x-auto pb-4">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[200px] pl-6 font-semibold">Teacher Name</TableHead>
                        <TableHead className="text-center font-semibold">Classes</TableHead>
                        <TableHead className="text-center font-semibold">Avg. Performance</TableHead>
                        <TableHead className="pr-6 text-right font-semibold">Attendance Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherPerformance.map((teacher, i) => (
                        <TableRow key={i} className="transition-colors hover:bg-muted/30">
                          <TableCell className="pl-6 font-medium text-foreground">{teacher.name}</TableCell>
                          <TableCell className="text-center">{teacher.classes}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                    <div 
                                        className="h-full bg-primary" 
                                        style={{ width: teacher.performance }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-foreground">{teacher.performance}</span>
                            </div>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              {teacher.attendance}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="flex flex-col border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-lg font-semibold">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground">Real-time campus updates</p>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {loading ? (
                <div className="space-y-6 p-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto px-6 pb-6 scrollbar-hide">
                  <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-border">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="relative flex gap-4">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-xs">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-semibold text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.detail}</p>
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/50">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
