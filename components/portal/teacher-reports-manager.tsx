"use client"

import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    BookMarked,
    FileBarChart,
    User,
    Download,
    TrendingUp,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const TeacherAttendanceTrendChart = dynamic(() => import("@/components/portal/teacher-reports-charts").then(mod => mod.TeacherAttendanceTrendChart), { ssr: false });
const TeacherPerformanceOverviewChart = dynamic(() => import("@/components/portal/teacher-reports-charts").then(mod => mod.TeacherPerformanceOverviewChart), { ssr: false });

import { useSession } from "next-auth/react"
import { TEACHER_SIDEBAR as sidebarItems } from "@/lib/navigation-config"
import { ASSESSMENT_PERIOD_OPTIONS, ACADEMIC_YEARS } from "@/lib/academic-constants"

interface TeacherReportsManagerProps {
    initialPerformanceData: any[];
    initialAttendanceTrendData: any[];
    initialStudentReports: any[];
    initialClasses: any[];
}

export function TeacherReportsManager({
    initialPerformanceData,
    initialAttendanceTrendData,
    initialStudentReports,
    initialClasses
}: TeacherReportsManagerProps) {
    const [loading, setLoading] = useState(false)
    const [selectedTerm, setSelectedTerm] = useState("mid-term")
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [selectedClass, setSelectedClass] = useState(initialClasses[0]?.id || "")
    const [searchQuery, setSearchQuery] = useState("")
    const { data: session } = useSession()

    const [calculatedData, setCalculatedData] = useState<{
        students: any[],
        performance: any[],
        attendance: any[],
        termAvg: number
    }>({
        students: [],
        performance: initialPerformanceData,
        attendance: initialAttendanceTrendData,
        termAvg: 0
    });

    useEffect(() => {
        if (!initialStudentReports || initialStudentReports.length === 0) return;

        // 1. Filter Students and calculate their specific stats for selected class/term
        const classStudents = (initialStudentReports || []).filter(s =>
            !selectedClass || (s.classes || []).some((c: any) => c.id === selectedClass)
        ).map(s => {
            const studentClass = (s.classes || []).find((c: any) => c.id === selectedClass) || s.classes?.[0];
            const termGrades = studentClass?.grades?.filter((g: any) => {
                const termMatches = !selectedTerm || g.term.includes(selectedTerm);
                const yearMatches = g.term.startsWith(selectedYear) || (new Date(g.createdAt).getFullYear().toString() === selectedYear && !g.term.includes('-'));
                return termMatches && yearMatches;
            }) || [];

            const termAttendances = studentClass?.attendances?.filter((a: any) =>
                new Date(a.date).getFullYear().toString() === selectedYear
            ) || [];

            const avgGrade = termGrades.length > 0
                ? Math.round(termGrades.reduce((acc: number, g: any) => acc + (g.marks || 0), 0) / termGrades.length)
                : 0;

            const attCount = termAttendances.length;
            const presCount = termAttendances.filter((a: any) => a.status === "PRESENT" || a.status === "present").length;
            const attRate = attCount > 0 ? Math.round((presCount / attCount) * 100) : 100;

            return {
                id: s.id,
                name: s.name,
                attendance: attRate,
                avgGrade: avgGrade,
                status: avgGrade > 85 ? "Excellent" : (avgGrade > 70 ? "Good" : "Average")
            };
        });

        // 2. Filter charts based on class if needed
        let perfData = initialPerformanceData;
        let attData = initialAttendanceTrendData;

        if (selectedClass) {
            // Recalculate Performance Trend for this specific class
            const terms = ["mid-term", "final-term"];
            perfData = terms.map(t => {
                const classGrades = initialStudentReports.flatMap(s =>
                    (s.classes || []).filter((c: any) => c.id === selectedClass).flatMap((c: any) =>
                        (c.grades || []).filter((g: any) => g.term.includes(t) && (g.term.startsWith(selectedYear) || new Date(g.createdAt).getFullYear().toString() === selectedYear))
                    )
                );
                const avg = classGrades.length > 0 ? Math.round(classGrades.reduce((a, b: any) => a + (b.marks || 0), 0) / classGrades.length) : 0;
                const top = classGrades.length > 0 ? Math.max(...classGrades.map((g: any) => g.marks || 0)) : 0;
                return { name: t === "mid-term" ? "Mid-Term" : "Final Examination", avg, top };
            }).filter(d => d.avg > 0);

            // Recalculate Attendance Trend for this specific class and year
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            attData = months.map((m, i) => {
                const monthAtt = initialStudentReports.flatMap(s =>
                    (s.classes || []).filter((c: any) => c.id === selectedClass).flatMap((c: any) =>
                        (c.attendances || []).filter((a: any) => a.date && new Date(a.date).getMonth() === i && new Date(a.date).getFullYear().toString() === selectedYear)
                    )
                );
                const rate = monthAtt.length > 0 ? Math.round((monthAtt.filter(a => a.status === "PRESENT" || a.status === "present").length / monthAtt.length) * 100) : 0;
                return { month: m, rate };
            }).filter(d => d.rate > 0);
        }

        const overallAvg = classStudents.length > 0 ? Math.round(classStudents.reduce((a, b) => a + b.avgGrade, 0) / classStudents.length) : 0;

        setCalculatedData({
            students: classStudents,
            performance: perfData.length > 0 ? perfData : initialPerformanceData,
            attendance: attData.length > 0 ? attData : initialAttendanceTrendData,
            termAvg: overallAvg
        });
    }, [selectedClass, selectedTerm, selectedYear, initialStudentReports, initialPerformanceData, initialAttendanceTrendData]);

    const filteredStudents = calculatedData.students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleExportCSV = () => {
        if (filteredStudents.length === 0) {
            toast.error("No data to export");
            return;
        }
        toast.success("Downloading CSV...");
        let csvContent = "Student Name,Attendance %,Avg Grade,Status\n" +
            filteredStudents.map(s => `"${s.name}",${s.attendance},${s.avgGrade},"${s.status}"`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `class-report-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <AppLayout
            sidebarItems={sidebarItems}
            userName={session?.user?.name || "Teacher"}
            userRole="teacher"
            userImage={session?.user?.image || undefined}
        >
            <div className="flex flex-col gap-8 pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="heading-2 text-burgundy-gradient">Academic Reports</h1>
                        <p className="text-sm text-muted-foreground">Comprehensive insights into class performance and attendance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-border hover:bg-muted text-sm flex items-center gap-2" onClick={handleExportCSV}>
                            <Download size={16} /> Export CSV
                        </Button>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 text-sm flex items-center gap-2" onClick={() => {
                            if (!selectedClass) {
                                toast.error("Please select a class first");
                                return;
                            }
                            const url = `/api/teacher/reports/export?classId=${selectedClass}&type=attendance&year=${selectedYear}`;
                            toast.success("Generating Attendance PDF...");
                            window.open(url, "_blank");
                        }}>
                            <Download size={16} /> Attendance PDF
                        </Button>
                        <Button className="bg-primary text-white hover:bg-primary/90 text-sm flex items-center gap-2" onClick={() => {
                            if (!selectedClass) {
                                toast.error("Please select a class first");
                                return;
                            }
                            const subjectValue = initialClasses.find(c => c.id === selectedClass)?.subject || "General";
                            const url = `/api/teacher/reports/export?classId=${selectedClass}&type=grades&term=${selectedTerm}&year=${selectedYear}&subjectId=${encodeURIComponent(subjectValue)}`;

                            toast.success("Generating Grades PDF...");
                            window.open(url, "_blank");
                        }}>
                            <Download size={16} /> Grades PDF Report
                        </Button>
                    </div>
                </div>

                <Card className="glass-panel border-border/50">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Academic Year</Label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="h-11 border-border bg-background/50"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>
                                        {ACADEMIC_YEARS.map(year => (
                                            <SelectItem key={year} value={year}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Academic Term</Label>
                                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                    <SelectTrigger className="h-11 border-border bg-background/50"><SelectValue placeholder="Select Term" /></SelectTrigger>
                                    <SelectContent>
                                        {ASSESSMENT_PERIOD_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="h-11 border-border bg-background/50"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {initialClasses.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Quick Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Student name..." className="h-11 pl-9 border-border bg-background/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="glass-panel border-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                            <CardTitle className="heading-3 flex items-center gap-2 text-lg"><TrendingUp size={20} className="text-primary" /> Performance Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {loading ? <Skeleton className="h-[300px] w-full rounded-xl" /> : <div className="h-[300px] w-full"><TeacherPerformanceOverviewChart data={calculatedData.performance} /></div>}
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
                            <CardTitle className="heading-3 flex items-center gap-2 text-lg"><Calendar size={20} className="text-primary" /> Attendance Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {loading ? <Skeleton className="h-[300px] w-full rounded-xl" /> : <div className="h-[300px] w-full"><TeacherAttendanceTrendChart data={calculatedData.attendance} /></div>}
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-panel overflow-hidden border-border/50">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="heading-3 flex items-center gap-2"><Users size={20} className="text-primary" /> Detailed Student Report</CardTitle>
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Class Average: {calculatedData.termAvg}%</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="w-[200px]">Student Name</TableHead>
                                    <TableHead className="text-center">Attendance %</TableHead>
                                    <TableHead className="text-center">Avg Grade</TableHead>
                                    <TableHead>Remarks</TableHead>
                                    <TableHead className="w-[120px] text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                                    ))
                                ) : (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-semibold">{student.name}</TableCell>
                                            <TableCell className="text-center font-medium">
                                                <span className={cn(student.attendance < 90 ? "text-amber-600" : "text-green-600")}>{student.attendance}%</span>
                                            </TableCell>
                                            <TableCell className="text-center"><Badge variant="secondary" className="bg-primary/5 text-primary">{student.avgGrade}%</Badge></TableCell>
                                            <TableCell className="text-sm text-muted-foreground italic">Maintaining steady improvement.</TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={cn(
                                                    "px-2 py-0.5 text-[10px] font-bold uppercase",
                                                    student.status === "Excellent" && "bg-green-100 text-green-700",
                                                    student.status === "Good" && "bg-blue-100 text-blue-700",
                                                    student.status === "Average" && "bg-amber-100 text-amber-700"
                                                )} variant="outline">{student.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
