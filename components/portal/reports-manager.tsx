"use client"

import { useState } from "react"
import { toast } from "sonner"
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
    Users,
    BarChart3,
    FileBarChart,
    Download,
    Printer,
    FileText,
    Calendar,
    Activity,
    TrendingUp,
    UserCheck,
    Award,
    Clock,
} from "lucide-react"
import dynamic from "next/dynamic"
import { AppLayout } from "@/components/layout/app-layout"
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const ReportAttendanceChart = dynamic(() => import("@/components/portal/report-charts").then(mod => mod.ReportAttendanceChart), { ssr: false });

interface ReportsManagerProps {
    initialData: {
        studentPerformance: any[];
        teacherPerformance: any[];
        attendanceChart: any[];
    }
}

export function ReportsManager({ initialData }: ReportsManagerProps) {
    const [reportType, setReportType] = useState("student-performance")
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    const handleGenerateReport = () => {
        setLoading(true)
        setShowPreview(false)
        // Immediate preview since data is pre-fetched
        setLoading(false)
        setShowPreview(true)
    }

    const handleExportCSV = () => {
        toast.success("Downloading CSV...");
        let csvContent = "";
        if (reportType === "student-performance") {
            csvContent = "Roll No,Name,Attendance,Avg Grade,Remarks\n" +
                initialData.studentPerformance.map(s => `${s.rollNo},"${s.name}",${s.attendance},${s.grade},"${s.remarks}"`).join("\n");
        } else if (reportType === "teacher-performance") {
            csvContent = "Teacher Name,Classes,Avg Class Grade,Attendance Rate\n" +
                initialData.teacherPerformance.map(t => `"${t.name}",${t.classes},${t.grade},${t.attendance}`).join("\n");
        } else {
            csvContent = "Data not available for CSV export";
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${reportType}-export-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return (
        <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <div>
                    <h1 className="heading-1 text-burgundy-gradient">Institutional Reports</h1>
                    <p className="text-sm text-muted-foreground">Generate comprehensive performance and operational summaries.</p>
                </div>

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
                                    <SelectTrigger className="h-11 glass-card"><SelectValue placeholder="Select term" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="spring26">Spring 2026</SelectItem>
                                        <SelectItem value="fall25">Fall 2025</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Class</Label>
                                <Select defaultValue="10a">
                                    <SelectTrigger className="h-11 glass-card"><SelectValue placeholder="Select class" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        <SelectItem value="10a">10-A</SelectItem>
                                        <SelectItem value="10b">10-B</SelectItem>
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

                {loading && (
                    <Card className="glass-panel border-border/50">
                        <CardContent className="p-8 space-y-4">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                )}

                {showPreview && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {reportType === "student-performance" && (
                            <Card className="glass-panel border-border/50 overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="heading-3 flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Student Performance Report</CardTitle>
                                            <CardDescription>Comprehensive academic summary for Grade 10-A</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/20">
                                            <TableRow className="border-border/50">
                                                <TableHead className="pl-6 uppercase text-[10px] tracking-wider">Roll No</TableHead>
                                                <TableHead className="uppercase text-[10px] tracking-wider">Name</TableHead>
                                                <TableHead className="uppercase text-[10px] tracking-wider">Attendance</TableHead>
                                                <TableHead className="text-center uppercase text-[10px] tracking-wider">Avg Grade</TableHead>
                                                <TableHead className="pr-6 uppercase text-[10px] tracking-wider">Remarks</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {initialData.studentPerformance.map((student) => (
                                                <TableRow key={student.rollNo} className="border-border/50 hover:bg-primary/5 transition-colors">
                                                    <TableCell className="pl-6 font-medium">{student.rollNo}</TableCell>
                                                    <TableCell className="font-semibold">{student.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{student.attendance}</TableCell>
                                                    <TableCell className="text-center"><Badge variant="outline" className="font-bold">{student.grade}</Badge></TableCell>
                                                    <TableCell className="pr-6 italic text-muted-foreground">{student.remarks}</TableCell>
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
                                    <Card className="glass-panel border-border/50 p-6 text-center"><p className="text-3xl font-bold text-emerald-600">93.4%</p><p className="text-xs text-muted-foreground uppercase font-bold">Overall Attendance</p></Card>
                                    <Card className="glass-panel border-border/50 p-6 text-center"><p className="text-3xl font-bold">785</p><p className="text-xs text-muted-foreground uppercase font-bold">Total Students</p></Card>
                                    <Card className="glass-panel border-border/50 p-6 text-center"><p className="text-3xl font-bold text-amber-600">6.6%</p><p className="text-xs text-muted-foreground uppercase font-bold">Absentee Rate</p></Card>
                                </div>
                                <Card className="glass-panel border-border/50">
                                    <CardHeader><CardTitle className="heading-3 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Attendance Trends</CardTitle></CardHeader>
                                    <CardContent><div className="h-[300px] w-full"><ReportAttendanceChart data={initialData.attendanceChart} /></div></CardContent>
                                </Card>
                            </div>
                        )}

                        {reportType === "teacher-performance" && (
                            <Card className="glass-panel border-border/50 overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                                    <CardTitle className="heading-3 flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Teacher Performance Report</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/20">
                                            <TableRow className="border-border/50">
                                                <TableHead className="pl-6">Teacher Name</TableHead>
                                                <TableHead>Classes</TableHead>
                                                <TableHead className="text-center">Avg Class Grade</TableHead>
                                                <TableHead className="pr-6 text-right">Attendance Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {initialData.teacherPerformance.map((teacher, i) => (
                                                <TableRow key={i} className="border-border/50 hover:bg-primary/5 transition-colors">
                                                    <TableCell className="pl-6 font-semibold">{teacher.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{teacher.classes}</TableCell>
                                                    <TableCell className="text-center"><Badge variant="outline" className="font-bold">{teacher.grade}</Badge></TableCell>
                                                    <TableCell className="pr-6 text-right font-bold text-emerald-600">{teacher.attendance}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 glass-card"><FileText className="h-4 w-4 text-primary" /> Export CSV</Button>
                            <Button variant="outline" size="sm" onClick={() => { toast.success("Downloading PDF..."); window.open("/api/admin/reports/export", "_blank"); }} className="gap-2 glass-card"><Download className="h-4 w-4 text-primary" /> Export PDF</Button>
                            <Button className="h-10 px-6 bg-primary text-white shadow-burgundy-glow" onClick={() => { toast.success("Printing..."); window.open("/api/admin/reports/export", "_blank"); }}><Printer className="mr-2 h-4 w-4" /> Print Report</Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
