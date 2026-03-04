"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
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

const MOCK_CHILDREN = ["Ahmed Ali", "Sara Ali"]

const MOCK_GRADES: Record<string, { subject: string; term: string; date: string; marks: string; total: string; grade: string }[]> = {
    "Ahmed Ali": [
        { subject: "Mathematics", term: "Spring 2026", date: "Feb 12, 2026", marks: "88", total: "100", grade: "A" },
        { subject: "Physics", term: "Spring 2026", date: "Feb 14, 2026", marks: "76", total: "100", grade: "B+" },
        { subject: "English", term: "Fall 2025", date: "Nov 10, 2025", marks: "91", total: "100", grade: "A+" },
        { subject: "Chemistry", term: "Fall 2025", date: "Nov 15, 2025", marks: "65", total: "100", grade: "B" },
        { subject: "Computer Science", term: "Spring 2026", date: "Feb 20, 2026", marks: "95", total: "100", grade: "A+" },
        { subject: "Urdu", term: "Fall 2025", date: "Nov 20, 2025", marks: "72", total: "100", grade: "B+" },
    ],
    "Sara Ali": [
        { subject: "Mathematics", term: "Spring 2026", date: "Feb 11, 2026", marks: "79", total: "100", grade: "B+" },
        { subject: "English", term: "Spring 2026", date: "Feb 13, 2026", marks: "85", total: "100", grade: "A" },
        { subject: "Islamiat", term: "Fall 2025", date: "Nov 08, 2025", marks: "93", total: "100", grade: "A+" },
        { subject: "Urdu", term: "Fall 2025", date: "Nov 18, 2025", marks: "80", total: "100", grade: "A" },
    ],
}

const TERMS = ["All Terms", "Spring 2026", "Fall 2025"]
const SUBJECTS = ["All Subjects", "Mathematics", "Physics", "English", "Chemistry", "Computer Science", "Urdu", "Islamiat"]

export default function ParentGradesPage() {
    const [selectedChild, setSelectedChild] = useState("Ahmed Ali")
    const [activeTerm, setActiveTerm] = useState("All Terms")
    const [activeSubject, setActiveSubject] = useState("All Subjects")

    const grades = MOCK_GRADES[selectedChild] || []
    const filtered = grades.filter(
        (g) =>
            (activeTerm === "All Terms" || g.term === activeTerm) &&
            (activeSubject === "All Subjects" || g.subject === activeSubject)
    )

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName="Parent User" userRole="Parent">
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
                            <Select value={selectedChild} onValueChange={setSelectedChild}>
                                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <SelectValue placeholder="Select Child" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_CHILDREN.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={activeTerm} onValueChange={setActiveTerm}>
                                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                    <SelectValue placeholder="Select Term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TERMS.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={activeSubject} onValueChange={setActiveSubject}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                    <SelectValue placeholder="Filter Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
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
                                {selectedChild} — Detailed Grades
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                            <TableHead className="w-[180px]">Subject</TableHead>
                                            <TableHead>Term</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Marks</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Grade</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.length > 0 ? (
                                            filtered.map((grade, i) => (
                                                <TableRow key={i} className="group border-border/50 transition-colors hover:bg-primary/5">
                                                    <TableCell className="font-medium">{grade.subject}</TableCell>
                                                    <TableCell className="text-muted-foreground">{grade.term}</TableCell>
                                                    <TableCell className="text-muted-foreground">{grade.date}</TableCell>
                                                    <TableCell className="text-right font-medium">{grade.marks}</TableCell>
                                                    <TableCell className="text-right text-muted-foreground">{grade.total}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge
                                                            variant={grade.grade.startsWith("A") ? "default" : "secondary"}
                                                            className="font-bold w-10 justify-center"
                                                        >
                                                            {grade.grade}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No grades found for the selected filters.
                                                </TableCell>
                                            </TableRow>
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
