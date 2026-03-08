"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
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
import dynamic from "next/dynamic"

const AttendanceTrendChart = dynamic(() => import("@/components/portal/analytics-charts").then(mod => mod.AttendanceTrendChart), { ssr: false });
const GradeDistributionChart = dynamic(() => import("@/components/portal/analytics-charts").then(mod => mod.GradeDistributionChart), { ssr: false });
const EnrollmentStatsChart = dynamic(() => import("@/components/portal/analytics-charts").then(mod => mod.EnrollmentStatsChart), { ssr: false });
const SubjectPerformanceChart = dynamic(() => import("@/components/portal/analytics-charts").then(mod => mod.SubjectPerformanceChart), { ssr: false });

import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"
import { ACADEMIC_YEARS, ASSESSMENT_PERIOD_OPTIONS } from "@/lib/academic-constants"

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

export function AnalyticsDashboardClient({ user }: { user: any }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>({
        attendanceData: [],
        gradeDistribution: [],
        enrollmentData: [],
        subjectPerformance: []
    })
    const [filters, setFilters] = useState({
        term: ASSESSMENT_PERIOD_OPTIONS[0]?.value || "march",
        classId: "all",
        year: ACADEMIC_YEARS[0] || "2026"
    })
    const [classes, setClasses] = useState<any[]>([])

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch("/api/admin/classes")
                if (!res.ok) throw new Error("Failed to fetch classes")
                const result = await res.json()
                setClasses(result.data || [])
            } catch (error) {
                console.error("Classes fetch error:", error)
            }
        }
        fetchClasses()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams(filters)
                const res = await fetch(`/api/admin/analytics?${params.toString()}`, { credentials: "include" })
                if (!res.ok) throw new Error("Failed to fetch analytics")
                const result = await res.json()
                setData(result)
            } catch (error) {
                console.error("Analytics fetch error:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [filters])

    const { attendanceData, gradeDistribution, enrollmentData, subjectPerformance } = data


    return (
        <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Admin"} userRole="admin">
            <div className="flex flex-col gap-8 pb-8">

                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Institutional Analytics</h1>
                        <p className="text-sm text-muted-foreground">Comprehensive insights into school performance and growth.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Assessment Period</Label>
                            <Select value={filters.term} onValueChange={(v) => setFilters(f => ({ ...f, term: v }))}>
                                <SelectTrigger className="h-10 w-full sm:w-36 glass-card">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSESSMENT_PERIOD_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Class</Label>
                            <Select value={filters.classId} onValueChange={(v) => setFilters(f => ({ ...f, classId: v }))}>
                                <SelectTrigger className="h-10 w-full sm:w-36 glass-card">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Year</Label>
                            <Select value={filters.year} onValueChange={(v) => setFilters(f => ({ ...f, year: v }))}>
                                <SelectTrigger className="h-10 w-full sm:w-32 glass-card">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACADEMIC_YEARS.map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
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
                                        <AttendanceTrendChart data={attendanceData} config={chartConfig} />
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
                                        <GradeDistributionChart data={gradeDistribution} config={chartConfig} />
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
                                        <EnrollmentStatsChart data={enrollmentData} config={chartConfig} />
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
                                        <SubjectPerformanceChart data={subjectPerformance} config={chartConfig} />
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
