"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookMarked,
  FileBarChart,
  User,
  Download,
  FilePieChart,
  TrendingUp,
  Award,
  Calendar,
  Search,
  ShieldCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
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
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

// Mock Data
const performanceData = [
  { name: "Unit 1", avg: 85, top: 98 },
  { name: "Unit 2", avg: 78, top: 95 },
  { name: "Midterm", avg: 82, top: 100 },
  { name: "Unit 3", avg: 86, top: 97 },
  { name: "Current", avg: 84, top: 99 },
]

const attendanceTrendData = [
  { month: "Sep", rate: 94 },
  { month: "Oct", rate: 92 },
  { month: "Nov", rate: 89 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 91 },
  { month: "Feb", rate: 95 },
]

const studentReports = [
  { id: "S001", name: "Ahmed Khan", attendance: 95, avgGrade: 88, status: "Excellent" },
  { id: "S002", name: "Sara Ali", attendance: 98, avgGrade: 94, status: "Excellent" },
  { id: "S003", name: "Hamza Butt", attendance: 88, avgGrade: 76, status: "Good" },
  { id: "S004", name: "Fatima Noor", attendance: 92, avgGrade: 89, status: "Excellent" },
  { id: "S005", name: "Bilal Shah", attendance: 82, avgGrade: 68, status: "Average" },
  { id: "S006", name: "Zain Malik", attendance: 85, avgGrade: 71, status: "Good" },
  { id: "S007", name: "Aisha Rehman", attendance: 96, avgGrade: 92, status: "Excellent" },
  { id: "S008", name: "Umar Farooq", attendance: 90, avgGrade: 81, status: "Good" },
]

export default function TeacherReportsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedTerm, setSelectedTerm] = useState("term2")
  const [selectedClass, setSelectedClass] = useState("10a")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredStudents = studentReports.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="teacher">
      <div className="flex flex-col gap-8 pb-8">
        {/* Header */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="heading-2 text-burgundy-gradient">Academic Reports</h1>
              <p className="text-sm text-muted-foreground">Comprehensive insights into class performance and attendance.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-border hover:bg-muted text-sm flex items-center gap-2"
                onClick={() => toast.success("Exporting data as CSV...")}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90 text-sm flex items-center gap-2"
                onClick={() => toast.success("Generating report PDF...")}
              >
                <Download className="h-4 w-4" />
                Save PDF
              </Button>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Filters */}
        <AnimatedWrapper delay={0.1}>
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-end">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Academic Term</Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term1">Term 1</SelectItem>
                      <SelectItem value="term2">Term 2</SelectItem>
                      <SelectItem value="term3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10a">Grade 10-A</SelectItem>
                      <SelectItem value="10b">Grade 10-B</SelectItem>
                      <SelectItem value="9a">Grade 9-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Quick Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Student name..."
                      className="h-11 pl-9 border-border bg-background/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Performance Chart */}
          <AnimatedWrapper delay={0.2}>
            <Card className="glass-panel border-border/50 overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                <CardTitle className="heading-3 flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Class Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="name"
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
                          dataKey="avg"
                          stroke="#800020"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#800020' }}
                          activeDot={{ r: 6 }}
                          name="Class Average"
                        />
                        <Line
                          type="monotone"
                          dataKey="top"
                          stroke="#A0522D"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={{ r: 4, fill: '#A0522D' }}
                          name="Top Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>

          {/* Attendance Chart */}
          <AnimatedWrapper delay={0.3}>
            <Card className="glass-panel border-border/50 overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                <CardTitle className="heading-3 flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Attendance Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceTrendData}>
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
                          dataKey="rate"
                          fill="#800020"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                          name="Attendance %"
                        >
                          {attendanceTrendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.rate < 90 ? '#A0522D' : '#800020'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>
        </div>

        {/* Student Table */}
        <AnimatedWrapper delay={0.4}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="heading-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Detailed Student Report
                </CardTitle>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                  Term Average: 84%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="w-[200px]">Student Name</TableHead>
                      <TableHead className="text-center">Attendance %</TableHead>
                      <TableHead className="text-center">Avg Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="w-[120px] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-border/50">
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell><div className="flex justify-end"><Skeleton className="h-6 w-16 rounded-full" /></div></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} className="group border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="font-semibold">{student.name}</TableCell>
                          <TableCell className="text-center font-medium">
                            <span className={cn(
                              student.attendance < 90 ? "text-amber-600" : "text-green-600"
                            )}>
                              {student.attendance}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                              {student.avgGrade}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground italic">
                            {student.status === "Excellent" ? "Exceptional progress this term." : "Maintaining steady improvement."}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={cn(
                              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              student.status === "Excellent" && "bg-green-100 text-green-700 border-green-200",
                              student.status === "Good" && "bg-blue-100 text-blue-700 border-blue-200",
                              student.status === "Average" && "bg-amber-100 text-amber-700 border-amber-200"
                            )} variant="outline">
                              {student.status}
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
    </AppLayout>
  )
}
