"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
  ArrowUpDown,
  Bell,
  CheckCircle2,
  ShieldCheck,
  User,
  Loader2
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

import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

// Dummy Data
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
  { subject: "Sci", avg: 78 },
  { subject: "Eng", avg: 82 },
  { subject: "Hist", avg: 88 },
  { subject: "Phys", avg: 75 },
  { subject: "Comp", avg: 92 },
]

const teacherPerformance = [
  { name: "Mr. Usman Sheikh", classes: 3, performance: 92, attendance: 98 },
  { name: "Dr. Ayesha Siddiqui", classes: 4, performance: 89, attendance: 95 },
  { name: "Ms. Nadia Jamil", classes: 3, performance: 94, attendance: 97 },
  { name: "Mr. Bilal Ahmed", classes: 4, performance: 87, attendance: 96 },
  { name: "Dr. Zainab Rizvi", classes: 3, performance: 91, attendance: 99 },
]

const recentActivityList = [
  { id: 1, action: "New student enrolled", detail: "Hamza Ali - Grade 9-B", time: "2h ago", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 2, action: "Grades updated", detail: "Grade 10-B Chemistry by Dr. Zainab", time: "3h ago", icon: FileBarChart, color: "text-purple-500", bg: "bg-purple-50" },
  { id: 3, action: "Attendance submitted", detail: "Grade 11-A by Mr. Sheikh", time: "5h ago", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: 4, action: "Announcement posted", detail: "Spring break dates confirmed", time: "6h ago", icon: Bell, color: "text-amber-500", bg: "bg-amber-50" },
  { id: 5, action: "Teacher onboarded", detail: "Ms. Hira Farooq - Biology", time: "1d ago", icon: Users, color: "text-pink-500", bg: "bg-pink-50" },
  { id: 6, action: "System update", detail: "Gradebook module optimization", time: "1d ago", icon: Settings, color: "text-slate-500", bg: "bg-slate-50" },
]

const kpiStats = [
  { label: "Total Students", value: "1,240", change: "+45", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Teachers", value: "68", change: "+3", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Total Staff", value: "42", change: "+1", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Attendance Rate", value: "94.2%", change: "+1.3%", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Avg Performance", value: "85%", change: "+2%", icon: Award, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Active Classes", value: "48", change: "0", icon: School, color: "text-pink-600", bg: "bg-pink-50" },
]

export default function AdminDashboard() {
  const { user, loading: authLoading } = useRequireAuth(['admin']);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Dr. Ahmad Raza"} userRole="admin">
      <div className="flex flex-col gap-8 pb-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="heading-1 text-burgundy-gradient">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive school performance monitoring and management.</p>
        </div>

        {/* Top Statistic Cards - Responsive 2 cols mobile, 3 tablet, 6 desktop */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpiStats.map((stat, i) => (
            <Card key={i} className="glass-card border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate" title={stat.label}>{stat.label}</p>
                      <div className="flex items-baseline gap-1.5">
                        <h3 className="text-lg font-bold text-foreground">{stat.value}</h3>
                        {stat.change !== "0" && (
                          <span className="text-[9px] font-bold text-emerald-600 flex items-center">
                            <TrendingUp size={10} className="mr-0.5" />
                            {stat.change}
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

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enrollment Trend - Line Chart */}
          <Card className="glass-panel border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="heading-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Enrollment Trend
              </CardTitle>
              <CardDescription>Monthly student enrollment growth for the current session.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[280px] w-full rounded-xl" />
              ) : (
                <div className="h-[280px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="#800020"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#800020', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Trend - Bar Chart */}
          <Card className="glass-panel border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="heading-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription>Average performance percentages across major subjects.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[280px] w-full rounded-xl" />
              ) : (
                <div className="h-[280px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis
                        dataKey="subject"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }}
                      />
                      <Bar
                        dataKey="avg"
                        fill="#800020"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Table and Activity List */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Teacher Performance Table - Responsive and Scrollable */}
          <Card className="glass-panel border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Teacher Performance
              </CardTitle>
              <CardDescription>Performance metrics for teaching staff based on current term audits.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="px-6 pb-6 space-y-4">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                        <TableHead className="w-[200px] pl-6 h-11">
                          <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                            Teacher Name <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="text-center h-11">
                          <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary transition-colors">
                            Classes <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="text-center h-11">
                          <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary transition-colors">
                            Avg Performance <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="pr-6 text-right h-11">
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                            Attendance Rate <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherPerformance.map((teacher, i) => (
                        <TableRow key={i} className="border-border/50 transition-colors hover:bg-primary/5">
                          <TableCell className="pl-6 font-medium text-foreground py-4">{teacher.name}</TableCell>
                          <TableCell className="text-center py-4">{teacher.classes}</TableCell>
                          <TableCell className="text-center py-4">
                            <div className="flex items-center justify-center gap-3">
                              <div className="hidden sm:block h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${teacher.performance}% ` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-primary">{teacher.performance}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="pr-6 text-right py-4">
                            <Badge variant="outline" className="text-[10px] font-bold border-green-200 bg-green-50 text-green-700">
                              {teacher.attendance}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Panel - Vertical Scrollable Side Card */}
          <Card className="glass-panel border-border/50 flex flex-col max-h-[500px]">
            <CardHeader className="shrink-0">
              <CardTitle className="heading-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Live feed of campus operations.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
              {loading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
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
                <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-border/60">
                  {recentActivityList.map((item) => (
                    <div key={item.id} className="relative flex gap-4 transition-all hover:translate-x-1">
                      <div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 ${item.bg} ${item.color} shadow-sm ring-2 ring-background`}>
                        <item.icon size={16} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-foreground leading-tight">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                          <Clock size={10} />
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
