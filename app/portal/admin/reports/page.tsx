"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
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
  School,
  BarChart3,
  FileBarChart,
  Settings,
  Download,
  Printer,
  FileText,
  Calendar,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  UserCheck,
  Award,
  ShieldCheck,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/periods", label: "Periods", icon: Clock },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
  { href: "/portal/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
  { href: "/portal/admin/school-settings", label: "School Settings", icon: Settings },
]

// Dummy Data
const studentPerformanceData = [
  { rollNo: "2025-0142", name: "Ahmed Khan", attendance: "94%", grade: "A", remarks: "Excellent" },
  { rollNo: "2025-0143", name: "Sara Ali", attendance: "98%", grade: "A+", remarks: "Outstanding" },
  { rollNo: "2025-0144", name: "Hamza Butt", attendance: "89%", grade: "B+", remarks: "Improving" },
  { rollNo: "2025-0145", name: "Fatima Noor", attendance: "92%", grade: "A", remarks: "Very Good" },
  { rollNo: "2025-0146", name: "Bilal Shah", attendance: "85%", grade: "B", remarks: "Satisfactory" },
]

const teacherPerformanceData = [
  { name: "Mr. Usman Sheikh", classes: "10-A, 10-B", grade: "A-", attendance: "96%" },
  { name: "Dr. Ayesha Siddiqui", classes: "9-A, 10-A", grade: "A", attendance: "98%" },
  { name: "Ms. Nadia Jamil", classes: "8-A, 9-A", grade: "B+", attendance: "94%" },
  { name: "Mr. Bilal Ahmed", classes: "10-B, 11-A", grade: "A-", attendance: "92%" },
]

const attendanceChartData = [
  { day: "Mon", attendance: 95 },
  { day: "Tue", attendance: 93 },
  { day: "Wed", attendance: 96 },
  { day: "Thu", attendance: 92 },
  { day: "Fri", attendance: 94 },
]

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("student-performance")
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerateReport = () => {
    setLoading(true)
    setShowPreview(false)
    setTimeout(() => {
      setLoading(false)
      setShowPreview(true)
    }, 1000)
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <div>
          <h1 className="heading-1 text-burgundy-gradient">Institutional Reports</h1>
          <p className="text-sm text-muted-foreground">Generate comprehensive performance and operational summaries.</p>
        </div>

        {/* Filters Section */}
        <Card className="glass-panel border-border/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-11 glass-card">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student-performance">Student Performance</SelectItem>
                    <SelectItem value="attendance-report">Attendance Report</SelectItem>
                    <SelectItem value="class-summary">Class Summary</SelectItem>
                    <SelectItem value="teacher-performance">Teacher Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Term</Label>
                <Select defaultValue="spring26">
                  <SelectTrigger className="h-11 glass-card">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring26">Spring 2026</SelectItem>
                    <SelectItem value="fall25">Fall 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Class</Label>
                <Select defaultValue="10a">
                  <SelectTrigger className="h-11 glass-card">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="10a">10-A</SelectItem>
                    <SelectItem value="10b">10-B</SelectItem>
                    <SelectItem value="9a">9-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Date Range</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Jan 2026 - Jun 2026" className="h-11 pl-9 glass-card" readOnly />
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow h-11 flex items-center justify-center gap-2"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <Activity className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generating Report...' : 'Generate Institutional Report'}
            </Button>
          </CardContent>
        </Card>

        {/* Report Preview Section */}
        {loading && (
          <div className="space-y-6">
            <Card className="glass-panel border-border/50">
              <CardContent className="p-8 space-y-4">
                <Skeleton className="h-8 w-1/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showPreview && (
          <div className="space-y-8 animate-in fade-in duration-500">

            {/* Conditional Previews */}
            {reportType === "student-performance" && (
              <Card className="glass-panel border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="heading-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Student Performance Report
                      </CardTitle>
                      <CardDescription>Comprehensive academic summary for Grade 10-A</CardDescription>
                    </div>
                    <Badge className="w-fit bg-emerald-50 text-emerald-700 border-emerald-200">Finalized</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow className="border-border/50">
                        <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Roll No</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Name</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Attendance</TableHead>
                        <TableHead className="text-center font-semibold h-12 uppercase text-[10px] tracking-wider">Avg Grade</TableHead>
                        <TableHead className="pr-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentPerformanceData.map((student) => (
                        <TableRow key={student.rollNo} className="border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="pl-6 font-medium py-4">{student.rollNo}</TableCell>
                          <TableCell className="font-semibold py-4">{student.name}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{student.attendance}</TableCell>
                          <TableCell className="text-center py-4">
                            <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                              {student.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 py-4 italic text-muted-foreground">{student.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {reportType === "attendance-report" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="glass-panel border-border/50">
                    <CardContent className="p-6 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Overall Attendance</p>
                      <p className="text-3xl font-bold text-emerald-600">93.4%</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-panel border-border/50">
                    <CardContent className="p-6 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Students</p>
                      <p className="text-3xl font-bold text-foreground">785</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-panel border-border/50">
                    <CardContent className="p-6 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Absentee Rate</p>
                      <p className="text-3xl font-bold text-amber-600">6.6%</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="heading-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Attendance Trends (Current Week)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} domain={[80, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                          <Line type="monotone" dataKey="attendance" stroke="#800020" strokeWidth={3} dot={{ r: 4, fill: '#800020' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {reportType === "class-summary" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="glass-panel border-border/50 p-6 flex flex-col items-center">
                    <Users className="h-6 w-6 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Students</p>
                    <p className="text-xl font-bold">32</p>
                  </Card>
                  <Card className="glass-panel border-border/50 p-6 flex flex-col items-center">
                    <Badge className="mb-2 bg-primary/10 text-primary border-none">A-</Badge>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Avg Grade</p>
                    <p className="text-xl font-bold text-primary">A-</p>
                  </Card>
                  <Card className="glass-panel border-border/50 p-6 flex flex-col items-center">
                    <Activity className="h-6 w-6 text-emerald-600 mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Attendance</p>
                    <p className="text-xl font-bold text-emerald-600">92%</p>
                  </Card>
                  <Card className="glass-panel border-border/50 p-6 flex flex-col items-center">
                    <FileBarChart className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Assignments</p>
                    <p className="text-xl font-bold text-blue-600">45</p>
                  </Card>
                </div>
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="heading-3">Basic Class Metrics</CardTitle>
                    <CardDescription>Operational breakdown for Grade 10-A</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-sm font-medium">Class Teacher</span>
                      <span className="text-sm text-primary font-bold">Mr. Usman Sheikh</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-sm font-medium">Room Assigned</span>
                      <span className="text-sm font-bold">Room 201</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-sm font-medium">Monthly Assessment Result</span>
                      <span className="text-sm font-bold text-primary">88% Average</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {reportType === "teacher-performance" && (
              <Card className="glass-panel border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Teacher Performance Report
                  </CardTitle>
                  <CardDescription>Evaluation of faculty academic delivery and engagement</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow className="border-border/50">
                        <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Teacher Name</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Classes</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-center">Avg Class Grade</TableHead>
                        <TableHead className="pr-6 font-semibold h-12 uppercase text-[10px] tracking-wider text-right">Attendance Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherPerformanceData.map((teacher, i) => (
                        <TableRow key={i} className="border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="pl-6 font-semibold py-4">{teacher.name}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{teacher.classes}</TableCell>
                          <TableCell className="text-center py-4">
                            <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                              {teacher.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right py-4 font-bold text-emerald-600">{teacher.attendance}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Export Section */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
              <p className="text-xs text-muted-foreground mr-auto hidden md:block">
                Generated on: {new Date().toLocaleDateString('en-PK')} {new Date().toLocaleTimeString('en-PK')}
              </p>
              <Button variant="outline" size="sm" className="h-9 gap-2 glass-card hover:bg-primary/5">
                <FileText className="h-4 w-4 text-primary" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 glass-card hover:bg-primary/5">
                <Download className="h-4 w-4 text-primary" />
                Export PDF
              </Button>
              <Button className="h-9 gap-2 bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow">
                <Printer className="h-4 w-4" />
                Print Report
              </Button>
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  )
}
