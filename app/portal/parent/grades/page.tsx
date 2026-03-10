"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import {
    GraduationCap,
    Users,
} from "lucide-react"
import { getTermDisplayLabel, ACADEMIC_YEARS, ASSESSMENT_PERIOD_OPTIONS } from "@/lib/academic-constants"
import { calculateGrade, isEligibleForPromotion, getGradeBadge } from "@/lib/academic-utils"

interface Grade {
    id: string;
    marks: number;
    total: number;
    term: string;
    subjectName: string;
    class: { name: string };
    submission?: { assignment: { title: string } };
    createdAt: string;
}

interface Child {
    id: string;
    name: string;
}

export default function ParentGradesPage() {
    const { data: session } = useSession()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChildId, setSelectedChildId] = useState<string>("")
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [grades, setGrades] = useState<Grade[]>([])
    const [activeTerm, setActiveTerm] = useState("All Periods")
    const [activeSubject, setActiveSubject] = useState("All Subjects")
    const [availableSubjects, setAvailableSubjects] = useState<string[]>(["All Subjects"])
    const [availableTerms, setAvailableTerms] = useState<string[]>(["All Periods"])
    const [loading, setLoading] = useState(true)
    const [gradesLoading, setGradesLoading] = useState(false)
    const [gradingSystem, setGradingSystem] = useState("percentage")
    const [promotionThreshold, setPromotionThreshold] = useState(40)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings")
                if (res.ok) {
                    const data = await res.json()
                    if (data.gradingSystem) setGradingSystem(data.gradingSystem)
                    if (data.promotionThreshold) setPromotionThreshold(Number(data.promotionThreshold))
                }
            } catch (e) {
                console.error("Failed to fetch settings:", e)
            }
        }
        fetchSettings()
    }, [])

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await fetch("/api/parent/children")
                if (res.ok) {
                    const data = await res.json()
                    setChildren(data)
                    if (data.length > 0) {
                        setSelectedChildId(data[0].id)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch children:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchChildren()
    }, [])

    useEffect(() => {
        if (!selectedChildId) return

        const fetchGrades = async () => {
            setGradesLoading(true)
            try {
                const res = await fetch(`/api/parent/child/${selectedChildId}/grades`)
                if (res.ok) {
                    const data = await res.json()
                    setGrades(data)

                    const uniqueSubjects = Array.from(new Set(data.map((g: any) => g.subjectName || "Unknown"))) as string[];
                    setAvailableSubjects(["All Subjects", ...uniqueSubjects])

                    const officialTerms = ASSESSMENT_PERIOD_OPTIONS.map(opt => opt.label);
                    const uniqueResultTerms = Array.from(new Set(data.map((g: any) => getTermDisplayLabel(g.term)))) as string[];
                    const alignedTerms = uniqueResultTerms.filter((t: string) => officialTerms.includes(t));
                    setAvailableTerms(["All Periods", ...alignedTerms])
                }
            } catch (error) {
                console.error("Failed to fetch grades:", error)
            } finally {
                setGradesLoading(false)
            }
        }
        fetchGrades()
    }, [selectedChildId])

    const filtered = grades.filter(g => {
        const termMatches = activeTerm === "All Periods" || getTermDisplayLabel(g.term) === activeTerm;
        const subjectMatches = activeSubject === "All Subjects" || g.subjectName === activeSubject;

        const yearPrefix = g.term?.split('-')[0];
        const isYearPrefixed = /^\d{4}$/.test(yearPrefix);
        const gradeYear = isYearPrefixed ? yearPrefix : new Date(g.createdAt).getFullYear().toString();
        const yearMatches = selectedYear === "All Years" || gradeYear === selectedYear;

        return termMatches && yearMatches && subjectMatches;
    })

    const averageMarks = filtered.length > 0
        ? filtered.reduce((acc, g) => acc + g.marks, 0) / filtered.length
        : 0;

    const selectedChildName = children.find(c => c.id === selectedChildId)?.name || "Child"

    if (loading) {
        return (
            <div className="flex flex-col gap-8 pb-8">
                <Skeleton className="h-12 w-64 mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 pb-8">
            {/* Header */}
            <AnimatedWrapper direction="down">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Grades</h1>
                        <p className="text-sm text-muted-foreground">
                            Detailed academic performance report for your child.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center flex-wrap">
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-full sm:w-[160px] bg-background">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <SelectValue placeholder="Select Child" />
                            </SelectTrigger>
                            <SelectContent>
                                {children.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full sm:w-[120px] bg-background">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Years">All Years</SelectItem>
                                {ACADEMIC_YEARS.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={activeSubject} onValueChange={setActiveSubject}>
                            <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSubjects.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={activeTerm} onValueChange={setActiveTerm}>
                            <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTerms.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </AnimatedWrapper>

            {/* Performance Summary Banner */}
            {filtered.length > 0 && (
                <AnimatedWrapper delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="glass-panel border-border/50 bg-primary/5">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Average Marks</p>
                                    <h3 className="text-3xl font-bold text-primary">{Math.round(averageMarks)}%</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`glass-panel border-border/50 ${isEligibleForPromotion(averageMarks, promotionThreshold) ? 'bg-green-500/5' : 'bg-destructive/5'}`}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Institution Standard</p>
                                    <h3 className={`text-3xl font-bold ${isEligibleForPromotion(averageMarks, promotionThreshold) ? 'text-green-600' : 'text-destructive'}`}>
                                        {isEligibleForPromotion(averageMarks, promotionThreshold) ? "PASS" : "FAIL"}
                                    </h3>
                                </div>
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isEligibleForPromotion(averageMarks, promotionThreshold) ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                                    <Badge variant={isEligibleForPromotion(averageMarks, promotionThreshold) ? "default" : "destructive"} className="text-[10px] px-1">
                                        Min: {promotionThreshold}%
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-panel border-border/50 bg-burgundy-900/5">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Grade</p>
                                    <h3 className="text-3xl font-bold text-burgundy-900">
                                        {calculateGrade(averageMarks, gradingSystem)}
                                    </h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-burgundy-900/10 flex items-center justify-center font-bold text-burgundy-900 text-[10px]">
                                    {gradingSystem.toUpperCase()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </AnimatedWrapper>
            )}

            {/* Grades Table */}
            <AnimatedWrapper delay={0.2}>
                <Card className="glass-panel overflow-hidden border-border/50">
                    <CardHeader>
                        <CardTitle className="heading-3 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            {selectedChildName} — Detailed Grades
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {gradesLoading ? (
                            <div className="p-8 space-y-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                            <TableHead className="w-[180px]">Subject</TableHead>
                                            <TableHead>Assessment Period</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Marks</TableHead>
                                            <TableHead className="text-right">Grade</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.length > 0 ? (
                                            filtered.map((grade) => (
                                                <TableRow key={grade.id} className="group border-border/50 transition-colors hover:bg-primary/5">
                                                    <TableCell className="font-medium">
                                                        {grade.subjectName}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">{getTermDisplayLabel(grade.term)}</TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(grade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">{grade.marks} / {grade.total || 100}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge
                                                            variant={getGradeBadge(grade.marks).variant}
                                                            className="font-bold min-w-[2.5rem] justify-center"
                                                        >
                                                            {calculateGrade(grade.marks, gradingSystem)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No grades found for the selected filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </AnimatedWrapper>
        </div>
    )
}
