"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    BookMarked,
    CheckCircle2,
    FileText,
    Search,
    ChevronRight,
    Calculator,
    AlertCircle,
    Loader2,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { ASSESSMENT_PERIOD_OPTIONS, ACADEMIC_YEARS } from "@/lib/academic-constants"
import { TEACHER_SIDEBAR as sidebarItems } from "@/lib/navigation-config"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileCardView } from "@/components/ui/mobile-card-view"

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
    const router = useRouter()
    const isMobile = useIsMobile()
    const [loading, setLoading] = useState(false)
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id || "")
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjects[0]?.id || "")
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [selectedTerm, setSelectedTerm] = useState("mid-term")
    const [students, setStudents] = useState<Student[]>([])
    const [grades, setGrades] = useState<Record<string, number>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [schoolSettings, setSchoolSettings] = useState<any>(null)
    const [classSubjectMap, setClassSubjectMap] = useState<Record<string, { id: string, name: string }[]>>({})
    const { data: session } = useSession()

    useEffect(() => {
        const map: Record<string, { id: string, name: string }[]> = {}
        initialClasses.forEach(c => {
            const subs = (c.subjects || "General").split(',').map((s: string) => s.trim())
            map[c.id] = subs.map((s: string) => ({
                id: s.toLowerCase().replace(/\s+/g, '-'),
                name: s
            }))
        })
        setClassSubjectMap(map)
    }, [initialClasses])

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
                    `/api/teacher/grades?classId=${selectedClassId}&subjectId=${selectedSubjectId}&term=${selectedTerm}&year=${selectedYear}`,
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
    }, [selectedClassId, selectedSubjectId, selectedTerm, selectedYear]);

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
                term: `${selectedYear}-${termValue}`,
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

        savePromise.then(() => router.refresh());
    }

    const handleSaveDraft = () => saveGrades(true)
    const handleSubmitFinal = () => saveGrades(false)

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery)
    )

    return (
        <AppLayout
            sidebarItems={sidebarItems}
            userName={session?.user?.name || "Teacher"}
            userRole="teacher"
            userImage={session?.user?.image || undefined}
        >
            <div className={`p-4 sm:p-6 space-y-6 ${isMobile ? 'pb-24' : ''}`}>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Assessments</h1>
                        <p className="text-sm text-muted-foreground">Manage student marks performance records.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <Button variant="outline" onClick={handleSaveDraft} className="glass-card">
                            <FileText size={16} className="mr-2" /> Save Draft
                        </Button>
                        <Button onClick={handleSubmitFinal} className="bg-primary text-white shadow-burgundy-glow/20">
                            <CheckCircle2 size={16} className="mr-2" /> Submit Final
                        </Button>
                    </div>
                </div>

                <Card className="glass-panel border-border/50">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 items-end">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Year</Label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="h-10 glass-card"><SelectValue placeholder="Year" /></SelectTrigger>
                                    <SelectContent>
                                        {ACADEMIC_YEARS.map(year => (
                                            <SelectItem key={year} value={year}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Class</Label>
                                <Select value={selectedClassId} onValueChange={(val) => {
                                    setSelectedClassId(val)
                                    const classSubs = classSubjectMap[val] || []
                                    setSelectedSubjectId(classSubs[0]?.id || "")
                                }}>
                                    <SelectTrigger className="h-10 glass-card"><SelectValue placeholder="Class" /></SelectTrigger>
                                    <SelectContent>
                                        {initialClasses.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Subject</Label>
                                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                                    <SelectTrigger className="h-10 glass-card"><SelectValue placeholder="Subject" /></SelectTrigger>
                                    <SelectContent>
                                        {(classSubjectMap[selectedClassId] || []).map((sub) => (
                                            <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Period</Label>
                                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                    <SelectTrigger className="h-10 glass-card"><SelectValue placeholder="Period" /></SelectTrigger>
                                    <SelectContent>
                                        {ASSESSMENT_PERIOD_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search..." className="h-10 pl-9 glass-card" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel overflow-hidden border-border/50">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2"><BookMarked size={18} className="text-primary" /> Mark Entry Sheet</CardTitle>
                            <Badge variant="secondary" className="rounded-full">{filteredStudents.length} Students</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className={cn("p-0", isMobile && "p-4 bg-secondary/10")}>
                        {loading ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
                        ) : isMobile ? (
                            <MobileCardView
                                data={filteredStudents}
                                primaryFieldKey="name"
                                fields={[
                                    {
                                        label: "NAME", key: "name", render: (val, s) => (
                                            <div className="flex flex-col">
                                                <span className="font-bold">{val}</span>
                                                <span className="text-[10px] font-mono opacity-60">#{s.rollNo}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        label: "MARKS (/100)", key: "marks", render: (_, s) => {
                                            const gradeInfo = calculateGrade(grades[s.id] || 0)
                                            return (
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="flex-1 flex items-center gap-2 bg-background border border-border/50 rounded-xl px-3 h-12">
                                                        <Calculator size={16} className="text-primary/40" />
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            className="border-none bg-transparent h-10 w-full text-lg font-bold shadow-none p-0"
                                                            value={grades[s.id] || ""}
                                                            onChange={(e) => handleMarksChange(s.id, e.target.value)}
                                                        />
                                                    </div>
                                                    <Badge className={cn("h-12 w-12 flex items-center justify-center font-bold text-lg rounded-xl", gradeInfo.color)}>
                                                        {gradeInfo.label}
                                                    </Badge>
                                                </div>
                                            )
                                        }
                                    }
                                ]}
                            />
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow>
                                        <TableHead className="w-[120px] pl-6 uppercase text-[10px] font-bold">Roll No</TableHead>
                                        <TableHead className="uppercase text-[10px] font-bold">Student Name</TableHead>
                                        <TableHead className="w-[180px] text-center uppercase text-[10px] font-bold">Marks (/100)</TableHead>
                                        <TableHead className="w-[150px] text-center uppercase text-[10px] font-bold">Grade</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => {
                                        const gradeInfo = calculateGrade(grades[student.id] || 0)
                                        return (
                                            <TableRow key={student.id} className="hover:bg-primary/5 transition-colors group">
                                                <TableCell className="pl-6 text-muted-foreground font-mono text-xs">{student.rollNo}</TableCell>
                                                <TableCell className="font-semibold">{student.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <Input type="number" min="0" max="100" className="h-10 w-24 text-center font-bold glass-card" value={grades[student.id] || ""} onChange={(e) => handleMarksChange(student.id, e.target.value)} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <Badge className={cn("font-bold transition-all px-3 py-1", gradeInfo.color)}>{gradeInfo.label}</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors hover:bg-primary/5"><ChevronRight size={16} /></Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-amber-800">
                    <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider">Academic Policy</p>
                        <p className="text-[11px] opacity-80 leading-relaxed font-medium">Verify marks accuracy before final submission. Late entries may require coordinator approval.</p>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-30 p-4 border-t bg-background/90 sm:hidden backdrop-blur-xl flex gap-3 safe-p-bottom">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider glass-card" onClick={handleSaveDraft}>Draft</Button>
                    <Button className="flex-[2] h-12 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-burgundy-glow/20" onClick={handleSubmitFinal}>Submit Final</Button>
                </div>
            </div>
        </AppLayout>
    )
}
