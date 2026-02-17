"use client"

import { useEffect, useState } from "react"
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
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface GradeData {
  students: Student[];
  grades: Record<string, number>;
}

export default function TeacherGradeEntryPage() {
  const [loading, setLoading] = useState(true)

  // Data State
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [students, setStudents] = useState<Student[]>([])

  // Selection State
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("")
  const [selectedTerm, setSelectedTerm] = useState("term1")

  // Grades State: Map studentId -> marks
  const [grades, setGrades] = useState<Record<string, number>>({})

  const [searchQuery, setSearchQuery] = useState("")

  // 1. Fetch Initial Data (Classes & Subjects)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          fetch(`${API_URL}/teacher/classes`),
          fetch(`${API_URL}/teacher/grades?type=subjects`) // Fetch subjects specifically
        ]);

        if (classesRes.ok) {
          const data = await classesRes.json();
          setClasses(data);
          if (data.length > 0) setSelectedClassId(data[0].id);
        }

        if (subjectsRes.ok) {
          const data = await subjectsRes.json();
          setSubjects(data);
          if (data.length > 0) setSelectedSubjectId(data[0].id);
        } else {
          // Fallback mock subjects if API fails or returns empty
          setSubjects([
            { id: 'math', name: 'Mathematics' },
            { id: 'physics', name: 'Physics' },
            { id: 'chem', name: 'Chemistry' }
          ]);
          setSelectedSubjectId('math');
        }

      } catch (error) {
        console.error("Failed to fetch initial data", error);
        toast.error("Failed to load classes or subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Fetch Students and Grades when selection changes
  useEffect(() => {
    if (!selectedClassId || !selectedSubjectId || !selectedTerm) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/teacher/grades?classId=${selectedClassId}&subjectId=${selectedSubjectId}&term=${selectedTerm}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
          setGrades(data.grades || {});
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch grades");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedClassId, selectedSubjectId, selectedTerm]);

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return { label: "A+", color: "bg-green-100 text-green-700 border-green-200" }
    if (marks >= 80) return { label: "A", color: "bg-green-50 text-green-600 border-green-100" }
    if (marks >= 70) return { label: "B", color: "bg-blue-50 text-blue-600 border-blue-100" }
    if (marks >= 60) return { label: "C", color: "bg-amber-50 text-amber-600 border-amber-100" }
    if (marks >= 50) return { label: "D", color: "bg-orange-50 text-orange-600 border-orange-100" }
    return { label: "F", color: "bg-red-50 text-red-600 border-red-100" }
  }

  const handleMarksChange = (studentId: string, value: string) => {
    const marks = parseInt(value) || 0
    if (marks >= 0 && marks <= 100) {
      setGrades((prev) => ({ ...prev, [studentId]: marks }))
    }
  }

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!")
  }

  const handleSubmitFinal = async () => {
    toast.info("Submitting grades for final review...", {
      description: "Once submitted, grades cannot be modified without admin approval.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            const gradesPayload = Object.entries(grades).map(([studentId, marks]) => ({
              studentId,
              marks
            }));

            const res = await fetch(`${API_URL}/teacher/grades`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                classId: selectedClassId,
                subjectId: selectedSubjectId,
                term: selectedTerm,
                grades: gradesPayload
              })
            });

            if (res.ok) {
              toast.success("Grades submitted for finalization!");
            } else {
              const err = await res.json();
              throw new Error(err.error || 'Failed to submit');
            }
          } catch (error: any) {
            toast.error(error.message || "Submission failed");
          }
        }
      },
    })
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.includes(searchQuery)
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="teacher">
      <div className="flex flex-col gap-6 pb-24 lg:pb-8">
        {/* Header */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="heading-2 text-burgundy-gradient">Grade Entry</h1>
              <p className="text-sm text-muted-foreground">Input and manage student marks for the current term.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSaveDraft} className="border-primary/20 text-primary hover:bg-primary/5 hidden sm:flex">
                <FileText className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handleSubmitFinal} className="bg-primary text-white hover:bg-primary/90">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Submit Final
              </Button>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Filters */}
        <AnimatedWrapper delay={0.1}>
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Class</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Subject</Label>
                  <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Term</Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term1">Term 1 (Mid-Year)</SelectItem>
                      <SelectItem value="term2">Final Examination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Student Name..."
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

        {/* Grade Entry Table */}
        <AnimatedWrapper delay={0.2}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="heading-3 flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  Mark Entry Sheet
                </CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calculator className="h-4 w-4" />
                    <span>Auto-calculated: 100% Total</span>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                    Total Students: {students.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20 text-xs uppercase tracking-wider">
                      <TableHead className="w-[120px]">Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-[180px] text-center">Marks (out of 100)</TableHead>
                      <TableHead className="w-[150px] text-center">Calculated Grade</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i} className="border-border/50">
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><div className="flex justify-center"><Skeleton className="h-10 w-24 rounded-md" /></div></TableCell>
                          <TableCell><div className="flex justify-center"><Skeleton className="h-7 w-14 rounded-full" /></div></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      filteredStudents.map((student) => {
                        const gradeInfo = calculateGrade(grades[student.id] || 0)
                        return (
                          <TableRow key={student.id} className="group border-border/50 hover:bg-primary/5 transition-colors">
                            <TableCell className="font-medium text-muted-foreground text-xs">{student.rollNo}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm">{student.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <div className="relative w-24">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="h-10 text-center font-bold text-primary focus-visible:ring-primary/20 border-border"
                                    value={grades[student.id] || ""}
                                    onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                  />
                                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    /100
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Badge className={cn("px-3 py-1 font-bold text-xs border transition-all", gradeInfo.color)}>
                                  {gradeInfo.label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Warning Section */}
        <AnimatedWrapper delay={0.3}>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Important Note</p>
              <p className="text-xs leading-relaxed opacity-80">
                Please ensure all marks are entered accurately before clicking "Submit Final". Final submissions are automatically reported to the academic coordinator and parent portal.
              </p>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Mobile Sticky Actions */}
        <div className="fixed bottom-0 left-0 right-0 z-10 flex gap-3 border-t border-border bg-background/80 p-4 backdrop-blur-md sm:hidden">
          <Button variant="outline" className="flex-1 h-12 border-primary/20 bg-background" onClick={handleSaveDraft}>
            Draft
          </Button>
          <Button className="flex-[2] h-12 bg-primary text-white" onClick={handleSubmitFinal}>
            Submit Final
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
