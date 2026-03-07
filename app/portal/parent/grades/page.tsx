"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import {
    LayoutDashboard,
    Clock,
    CalendarCheck,
    GraduationCap,
    Megaphone,
    Users,
} from "lucide-react"

const PARENT_SIDEBAR = [
    { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/parent/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/parent/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/parent/grades", label: "Grades", icon: GraduationCap },
    { href: "/portal/parent/announcements", label: "Announcements", icon: Megaphone },
]

interface Grade {
    id: string;
    marks: number;
    term: string;
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
    const [grades, setGrades] = useState<Grade[]>([])
    const [activeTerm, setActiveTerm] = useState("All Periods")
    const [loading, setLoading] = useState(true)
    const [gradesLoading, setGradesLoading] = useState(false)

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
                }
            } catch (error) {
                console.error("Failed to fetch grades:", error)
            } finally {
                setGradesLoading(false)
            }
        }
        fetchGrades()
    }, [selectedChildId])

    const termMapping: Record<string, string> = {
        "september-2025": "September 2025",
        "october-2025": "October 2025",
        "november-2025": "November 2025",
        "mid-term": "Mid-Term Exam",
        "december-2025": "December 2025",
        "january-2026": "January 2026",
        "february-2026": "February 2026",
        "march-2026": "March 2026",
        "final-term": "Final Exam"
    };

    const terms = ["All Periods", ...Array.from(new Set(grades.map(g => termMapping[g.term] || g.term)))]

    const filtered = grades.filter(
        (g) => (activeTerm === "All Periods" || (termMapping[g.term] || g.term) === activeTerm)
    )

    const selectedChildName = children.find(c => c.id === selectedChildId)?.name || "Child"

    if (loading) {
        return (
            <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
                <Skeleton className="h-12 w-64 mb-8" />
                <Skeleton className="h-64 w-full" />
            </AppLayout>
        )
    }

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
            <div className="flex flex-col gap-8 pb-8">
                {/* Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="heading-1 text-burgundy-gradient">Grades</h1>
                            <p className="text-sm text-muted-foreground">
                                Read-only academic performance report for your child.
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

                            <Select value={activeTerm} onValueChange={setActiveTerm}>
                                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                    <SelectValue placeholder="Select Term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {terms.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </AnimatedWrapper>

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
                                                <TableHead className="w-[180px]">Class / Subject</TableHead>
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
                                                            {grade.class.name}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">{termMapping[grade.term] || grade.term}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {new Date(grade.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">{grade.marks}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge
                                                                variant={grade.marks >= 80 ? "default" : "secondary"}
                                                                className="font-bold min-w-[2.5rem] justify-center"
                                                            >
                                                                {grade.marks >= 90 ? "A+" : grade.marks >= 80 ? "A" : grade.marks >= 70 ? "B" : "C"}
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
        </AppLayout>
    )
}
