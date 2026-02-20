"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BarChart3,
  FileBarChart,
  Settings,
  TrendingUp,
  Users2,
  BarChart as BarChartIcon,
  CalendarCheck,
  PieChart as PieChartIcon,
  ShieldCheck,
  Clock,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'

import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

// Mock Data
const attendanceData = [
  { month: 'Sep', attendance: 92 },
  { month: 'Oct', attendance: 94 },
  { month: 'Nov', attendance: 91 },
  { month: 'Dec', attendance: 88 },
  { month: 'Jan', attendance: 95 },
  { month: 'Feb', attendance: 93 },
]

const gradeDistribution = [
  { grade: 'A', count: 45 },
  { grade: 'B', count: 32 },
  { grade: 'C', count: 18 },
  { grade: 'D', count: 5 },
  { grade: 'F', count: 2 },
]

const enrollmentData = [
  { year: '2020', students: 450 },
  { year: '2021', students: 520 },
  { year: '2022', students: 580 },
  { year: '2023', students: 640 },
  { year: '2024', students: 710 },
  { year: '2025', students: 785 },
]

const subjectPerformance = [
  { subject: 'Math', avg: 78 },
  { subject: 'Science', avg: 82 },
  { subject: 'English', avg: 85 },
  { subject: 'Comp Sci', avg: 88 },
  { subject: 'History', avg: 75 },
  { subject: 'Arts', avg: 90 },
]

const chartConfig = {
  gridStroke: "#E5E7EB",
  tickColor: "#6B7280",
  primaryColor: "#800020",
  primaryGradient: "colorScore",
  tooltipStyle: {
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontSize: '12px'
  }
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useRequireAuth(['admin']);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (authLoading) {
    return null;
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Dr. Ahmad Raza"} userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading-1 text-burgundy-gradient">Institutional Analytics</h1>
            <p className="text-sm text-muted-foreground">Comprehensive insights into school performance and growth.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Term</Label>
              <Select defaultValue="spring26">
                <SelectTrigger className="h-10 w-full sm:w-36 glass-card">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall25">Fall 2025</SelectItem>
                  <SelectItem value="spring26">Spring 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Class</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-full sm:w-36 glass-card">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Year</Label>
              <Select defaultValue="2025">
                <SelectTrigger className="h-10 w-full sm:w-32 glass-card">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 1. Attendance Trends */}
          <Card className="glass-panel border-border/50">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Attendance Trends
              </CardTitle>
              <CardDescription>Monthly attendance percentage across all grades</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <div className="h-[300px] w-full">
                  {!attendanceData || attendanceData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground italic">No attendance data available</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.gridStroke} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: chartConfig.tickColor }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: chartConfig.tickColor }}
                          domain={[80, 100]}
                        />
                        <Tooltip contentStyle={chartConfig.tooltipStyle} />
                        <Line
                          type="monotone"
                          dataKey="attendance"
                          stroke={chartConfig.primaryColor}
                          strokeWidth={3}
                          dot={{ r: 4, fill: chartConfig.primaryColor, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Grade Distribution */}
          <Card className="glass-panel border-border/50">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Grade Distribution
              </CardTitle>
              <CardDescription>Frequency of grades across current term</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <div className="h-[300px] w-full">
                  {!gradeDistribution || gradeDistribution.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground italic">No grade distribution data available</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.gridStroke} />
                        <XAxis
                          dataKey="grade"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: chartConfig.tickColor }}
                          dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartConfig.tickColor }} />
                        <Tooltip
                          cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                          contentStyle={chartConfig.tooltipStyle}
                        />
                        <Bar
                          dataKey="count"
                          fill={chartConfig.primaryColor}
                          radius={[6, 6, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Enrollment Statistics */}
          <Card className="glass-panel border-border/50">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-2">
                <Users2 className="h-5 w-5 text-primary" />
                Enrollment Statistics
              </CardTitle>
              <CardDescription>Growth in student population over the years</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <div className="h-[300px] w-full">
                  {!enrollmentData || enrollmentData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground italic">No enrollment data available</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={enrollmentData}>
                        <defs>
                          <linearGradient id={chartConfig.primaryGradient} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartConfig.primaryColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartConfig.primaryColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.gridStroke} />
                        <XAxis
                          dataKey="year"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: chartConfig.tickColor }}
                          dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartConfig.tickColor }} />
                        <Tooltip contentStyle={chartConfig.tooltipStyle} />
                        <Area
                          type="monotone"
                          dataKey="students"
                          stroke={chartConfig.primaryColor}
                          strokeWidth={3}
                          fillOpacity={1}
                          fill={`url(#${chartConfig.primaryGradient})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Subject-wise Performance */}
          <Card className="glass-panel border-border/50">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Subject-wise Performance
              </CardTitle>
              <CardDescription>Average scores across core departments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <div className="h-[300px] w-full">
                  {!subjectPerformance || subjectPerformance.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground italic">No subject performance data available</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectPerformance} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartConfig.gridStroke} />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: chartConfig.tickColor }}
                        />
                        <YAxis
                          dataKey="subject"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: chartConfig.tickColor }}
                          width={80}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                          contentStyle={chartConfig.tooltipStyle}
                        />
                        <Bar
                          dataKey="avg"
                          fill={chartConfig.primaryColor}
                          radius={[0, 6, 6, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  )
}
