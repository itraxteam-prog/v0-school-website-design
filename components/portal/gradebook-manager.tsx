"use client"

import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    BookMarked,
    FileBarChart,
    User,
    Save,
    CheckCircle2,
    FileText,
    Search,
    ChevronRight,
    Calculator,
    AlertCircle,
    ShieldCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

interface Student {
    id: string;
    name: string;
    rollNo: string;
}

interface GradebookManagerProps {
    initialClasses: any[];
    initialSubjects: any[];
}

export function GradebookManager({ initialClasses, initialSubjects }: GradebookManagerProps) {
    const [loading, setLoading] = useState(false)
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id || "")
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjects[0]?.id || "")
    const [selectedTerm, setSelectedTerm] = useState("term1")
    const [students, setStudents] = useState<Student[]>([])
    const [grades, setGrades] = useState<Record<string, number>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [schoolSettings, setSchoolSettings] = useState<any>(null)

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => { if (!data.error) setSchoolSettings(data) })
            .catch(console.error)
    }, [])

    useEffect(() => {
        if (!selectedClassId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch students for this class
                const studentsRes = await fetch(`/api/teacher/students?classId=${selectedClassId}`, { credentials: "include" });
                let studentList: Student[] = [];
                if (studentsRes.ok) {
                    const result = await studentsRes.json();
                    studentList = result.data || [];
                }

                setStudents(studentList);

                // Fetch grades
                const gradesRes = await fetch(
                    `/api/teacher/grades?classId=${selectedClassId}&subjectId=${selectedSubjectId}&term=${selectedTerm}`,
                    { credentials: "include" }
                );
                const gradeMap: Record<string, number> = {};
                if (gradesRes.ok) {
                    const gradesResult = await gradesRes.json();
                    (gradesResult.data || []).forEach((g: any) => {
                        gradeMap[g.studentId] = g.marks;
                    });
                }
                setGrades(gradeMap);

            } catch (error) {
                toast.error("Failed to fetch grades");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedClassId, selectedSubjectId, selectedTerm]);

    const calculateGrade = (marks: number) => {
        const gradingSystem = schoolSettings?.gradingSystem || 'percentage'
        const passThreshold = Number(schoolSettings?.promotionThreshold || 40)

        if (gradingSystem === 'gpa') {
            // 4.0 GPA scale
            if (marks >= 93) return { label: "A+", color: "bg-green-100 text-green-700" }
            if (marks >= 87) return { label: "A", color: "bg-green-50 text-green-600" }
            if (marks >= 80) return { label: "B+", color: "bg-blue-50 text-blue-600" }
            if (marks >= 73) return { label: "B", color: "bg-blue-50 text-blue-500" }
            if (marks >= 67) return { label: "C+", color: "bg-amber-50 text-amber-600" }
            if (marks >= 60) return { label: "C", color: "bg-amber-50 text-amber-500" }
            if (marks >= passThreshold) return { label: "D", color: "bg-orange-50 text-orange-600" }
            return { label: "F", color: "bg-red-50 text-red-600" }
        }

        // Percentage-based or relative
        if (marks >= 90) return { label: "A+", color: "bg-green-100 text-green-700" }
        if (marks >= 80) return { label: "A", color: "bg-green-50 text-green-600" }
        if (marks >= 70) return { label: "B", color: "bg-blue-50 text-blue-600" }
        if (marks >= 60) return { label: "C", color: "bg-amber-50 text-amber-600" }
        if (marks >= passThreshold) return { label: "D", color: "bg-orange-50 text-orange-600" }
        return { label: "F", color: "bg-red-50 text-red-600" }
    }

    const handleMarksChange = (studentId: string, value: string) => {
        const marks = parseInt(value) || 0
        if (marks >= 0 && marks <= 100) {
            setGrades((prev) => ({ ...prev, [studentId]: marks }))
        }
    }

    const saveGrades = async (isDraft: boolean) => {
        const records = students.map(s => ({
            studentId: s.id,
            marks: grades[s.id] ?? 0,
        }));

        const termValue = isDraft ? `${selectedTerm}-draft` : selectedTerm;

        const savePromise = fetch("/api/teacher/grades", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                classId: selectedClassId,
                subjectId: selectedSubjectId,
                term: termValue,
                grades: records,
            }),
        }).then(async (res) => {
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to save grades");
            }
            return res.json();
        });

        toast.promise(savePromise, {
            loading: isDraft ? "Saving draft..." : "Submitting grades...",
            success: isDraft ? "Draft saved successfully!" : "Grades submitted successfully!",
            error: (err) => err.message || "Failed to save grades",
        });
    }

    const handleSaveDraft = () => saveGrades(true)
    const handleSubmitFinal = () => saveGrades(false)

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery)
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="teacher">
            <div className="flex flex-col gap-6 pb-24 lg:pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="heading-2 text-burgundy-gradient">Grade Entry</h1>
                        <p className="text-sm text-muted-foreground">Input and manage student marks for the current term.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleSaveDraft} className="hidden sm:flex">
                            <FileText size={16} className="mr-2" /> Save Draft
                        </Button>
                        <Button onClick={handleSubmitFinal} className="bg-primary text-white">
                            <CheckCircle2 size={16} className="mr-2" /> Submit Final
                        </Button>
                    </div>
                </div>

                <Card className="glass-panel border-border/50">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Class</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {initialClasses.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Subject</Label>
                                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                    <SelectContent>
                                        {initialSubjects.map((sub) => (
                                            <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Term</Label>
                                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Term" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="term1">Term 1 (Mid-Year)</SelectItem>
                                        <SelectItem value="term2">Final Examination</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Student Name..." className="h-11 pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel overflow-hidden border-border/50">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle className="heading-3 flex items-center gap-2"><BookMarked size={20} className="text-primary" /> Mark Entry Sheet</CardTitle>
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-1"><Calculator size={14} /> Auto-calculated</span>
                                <Badge variant="outline" className="border-primary/20 text-primary">Students: {students.length}</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="w-[120px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-[180px] text-center">Marks (/100)</TableHead>
                                    <TableHead className="w-[150px] text-center">Grade</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                                    ))
                                ) : (
                                    filteredStudents.map((student) => {
                                        const gradeInfo = calculateGrade(grades[student.id] || 0)
                                        return (
                                            <TableRow key={student.id} className="hover:bg-primary/5 transition-colors group">
                                                <TableCell className="text-muted-foreground font-mono text-xs">{student.rollNo}</TableCell>
                                                <TableCell className="font-semibold">{student.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <Input type="number" min="0" max="100" className="h-10 w-24 text-center font-bold" value={grades[student.id] || ""} onChange={(e) => handleMarksChange(student.id, e.target.value)} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <Badge className={cn("font-bold", gradeInfo.color)}>{gradeInfo.label}</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors"><ChevronRight size={16} /></Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-800">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold">Important Note</p>
                        <p className="text-xs opacity-80 leading-relaxed">Please ensure all marks are entered accurately. Final submissions are reported to the academic coordinator.</p>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t bg-background/80 sm:hidden backdrop-blur flex gap-3">
                    <Button variant="outline" className="flex-1 h-12" onClick={handleSaveDraft}>Draft</Button>
                    <Button className="flex-[2] h-12 bg-primary text-white" onClick={handleSubmitFinal}>Submit Final</Button>
                </div>
            </div>
        </AppLayout>
    )
}
