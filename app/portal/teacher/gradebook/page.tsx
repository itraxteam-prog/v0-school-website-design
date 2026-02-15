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
]

const initialStudents = [
  { id: "S001", name: "Ahmed Khan", rollNo: "2025-0142", initialMarks: 85 },
  { id: "S002", name: "Sara Ali", rollNo: "2025-0143", initialMarks: 92 },
  { id: "S003", name: "Hamza Butt", rollNo: "2025-0144", initialMarks: 78 },
  { id: "S004", name: "Fatima Noor", rollNo: "2025-0145", initialMarks: 88 },
  { id: "S005", name: "Bilal Shah", rollNo: "2025-0146", initialMarks: 65 },
  { id: "S006", name: "Zain Malik", rollNo: "2025-0147", initialMarks: 72 },
  { id: "S007", name: "Aisha Rehman", rollNo: "2025-0148", initialMarks: 95 },
  { id: "S008", name: "Umar Farooq", rollNo: "2025-0149", initialMarks: 81 },
]

export default function TeacherGradeEntryPage() {
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState("10a")
  const [selectedSubject, setSelectedSubject] = useState("math")
  const [selectedTerm, setSelectedTerm] = useState("term1")
  const [grades, setGrades] = useState<Record<string, number>>(
    Object.fromEntries(initialStudents.map((s) => [s.id, s.initialMarks]))
  )
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

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

  const handleSubmitFinal = () => {
    toast.info("Submitting grades for final review...", {
      description: "Once submitted, grades cannot be modified without admin approval.",
      action: {
        label: "Confirm",
        onClick: () => toast.success("Grades submitted for finalization!")
      },
    })
  }

  const filteredStudents = initialStudents.filter((s) =>
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
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10a">Grade 10-A</SelectItem>
                      <SelectItem value="10b">Grade 10-B</SelectItem>
                      <SelectItem value="9a">Grade 9-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="h-11 border-border bg-background/50">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chem">Chemistry</SelectItem>
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
                    Total Students: {initialStudents.length}
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
                        const gradeInfo = calculateGrade(grades[student.id])
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
                                    value={grades[student.id]}
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
