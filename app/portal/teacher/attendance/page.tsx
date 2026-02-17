"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookMarked,
  FileBarChart,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Search,
  Check,
  MessageSquare,
  Filter,
  Calendar as CalendarIcon,
  ShieldCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
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

// Internal API base path
const API_BASE = "/api";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  classId: string;
  avatar?: string;
}


type AttendanceStatus = "present" | "absent" | "late"

interface AttendanceRecord {
  status: AttendanceStatus
  remarks: string
}

export default function TeacherAttendancePage() {
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())

  // Data State
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])

  // Attendance State: Map studentId -> { status, remarks }
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})

  const [searchQuery, setSearchQuery] = useState("")

  // 1. Fetch Classes on Mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_BASE}/teacher/classes`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API ERROR [fetchTeacherClasses]:", res.status, errorText);
          throw new Error(errorText || "Failed to fetch classes");
        }
        const result = await res.json();
        const data = result.data || [];
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // 2. Fetch Students when Class Changes (or fetch all once and filter)
  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      if (!selectedClassId) return;

      setLoading(true);
      try {
        // Fetch Students
        const studRes = await fetch(`${API_BASE}/students`, {
          method: "GET",
          credentials: "include",
        });
        if (!studRes.ok) {
          const errorText = await studRes.text();
          console.error("API ERROR [fetchStudents]:", studRes.status, errorText);
          throw new Error(errorText || "Failed to load students");
        }
        const studResult = await studRes.json();
        const allStudents: Student[] = studResult.data || [];

        // Filter for selected class
        const classStudents = allStudents.filter((s: any) => s.classId === selectedClassId);
        setStudents(classStudents);

        // Initialize attendance state for these students with default 'present'
        const initialAttendance: Record<string, AttendanceRecord> = {};
        classStudents.forEach(s => {
          initialAttendance[s.id] = { status: 'present', remarks: '' };
        });

        // Fetch Existing Attendance
        const dateStr = format(date, 'yyyy-MM-dd');
        const attRes = await fetch(`${API_BASE}/attendance?classId=${selectedClassId}&date=${dateStr}`, {
          method: "GET",
          credentials: "include",
        });
        if (attRes.ok) {
          const attResult = await attRes.json();
          const existingRecords = attResult.data || [];
          // Merge existing records
          if (Array.isArray(existingRecords)) {
            existingRecords.forEach((r: any) => {
              if (initialAttendance[r.student_id]) {
                initialAttendance[r.student_id] = {
                  status: r.status,
                  remarks: r.remarks || ''
                };
              }
            });
          }
        }

        setAttendance(initialAttendance);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndAttendance();
  }, [selectedClassId, date]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }))
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }))
  }

  const markAll = (status: AttendanceStatus) => {
    setAttendance((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], status }
      })
      return next
    })
    toast.success(`Marked all students as ${status}`)
  }

  const handleSave = async () => {
    if (!selectedClassId) return;

    try {
      const records = Object.entries(attendance).map(([studentId, record]) => ({
        studentId,
        status: record.status,
        remarks: record.remarks
      }));

      const res = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          classId: selectedClassId,
          date: format(date, 'yyyy-MM-dd'),
          records
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API ERROR [saveAttendance]:", res.status, errorText);
        const err = JSON.parse(errorText || '{}');
        throw new Error(err.error || errorText || 'Failed to save');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save attendance");
    }
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
              <h1 className="heading-2 text-burgundy-gradient">Teacher Attendance</h1>
              <p className="text-sm text-muted-foreground">Manage daily attendance for your students.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} className="bg-primary text-white hover:bg-primary/90 hidden md:flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Attendance
              </Button>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Filters & Actions */}
        <AnimatedWrapper delay={0.1}>
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                {/* Date Picker */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-border h-11",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{date ? format(date, "PPP") : "Pick a date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Class Selector */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Class</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger className="h-11 border-border">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Search Student</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Name or Roll No..."
                      className="h-11 pl-9 border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 text-[10px] sm:text-xs font-bold uppercase tracking-tight"
                    onClick={() => markAll("present")}
                  >
                    All Present
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 text-[10px] sm:text-xs font-bold uppercase tracking-tight"
                    onClick={() => markAll("absent")}
                  >
                    All Absent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Student Table */}
        <AnimatedWrapper delay={0.2}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="heading-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Student List
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {Object.values(attendance).filter(a => a.status === 'present').length} Present
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-red-600" />
                    {Object.values(attendance).filter(a => a.status === 'absent').length} Absent
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="w-[80px]">Roll No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-[180px]">Status</TableHead>
                      <TableHead className="min-w-[200px]">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i} className="border-border/50">
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </TableCell>
                          <TableCell><Skeleton className="h-9 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-9 w-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} className="group border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="font-medium text-xs text-muted-foreground">{student.rollNo}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                {student.avatar || student.name.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-sm">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={attendance[student.id]?.status || "present"}
                              onValueChange={(val) => handleStatusChange(student.id, val as AttendanceStatus)}
                            >
                              <SelectTrigger className={cn(
                                "h-9 w-full text-xs font-semibold border-border transition-colors",
                                attendance[student.id]?.status === "present" && "bg-green-50 text-green-700 border-green-200",
                                attendance[student.id]?.status === "absent" && "bg-red-50 text-red-700 border-red-200",
                                attendance[student.id]?.status === "late" && "bg-amber-50 text-amber-700 border-amber-200"
                              )}>
                                <div className="flex items-center gap-2">
                                  {attendance[student.id]?.status === "present" && <CheckCircle2 className="h-3.5 w-3.5" />}
                                  {attendance[student.id]?.status === "absent" && <XCircle className="h-3.5 w-3.5" />}
                                  {attendance[student.id]?.status === "late" && <Clock className="h-3.5 w-3.5" />}
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span>Present</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="absent">
                                  <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span>Absent</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="late">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    <span>Late</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="relative group/remarks">
                              <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 group-hover/remarks:text-primary transition-colors" />
                              <Input
                                placeholder="Add note..."
                                className="h-9 pl-9 border-border text-xs focus-visible:ring-primary/20"
                                value={attendance[student.id]?.remarks || ""}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Mobile Pinned Save Button */}
        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/80 p-4 backdrop-blur-md md:hidden">
          <Button onClick={handleSave} className="w-full bg-primary text-white shadow-lg active:scale-95 transition-transform h-12 text-base">
            <Save className="mr-2 h-5 w-5" />
            Save Attendance
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
