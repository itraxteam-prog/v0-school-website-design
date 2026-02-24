"use client"

import { useState, useEffect } from "react"
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
    Calendar as CalendarIcon,
    ShieldCheck,
    MessageSquare,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
    id: string;
    name: string;
    rollNo: string;
    classId: string;
    avatar?: string;
}

interface AttendanceRecord {
    status: AttendanceStatus
    remarks: string
}

interface AttendanceManagerProps {
    initialClasses: any[];
}

export function AttendanceManager({ initialClasses }: AttendanceManagerProps) {
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState<Date>(new Date())
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id || "")
    const [students, setStudents] = useState<Student[]>([])
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchStudentsAndAttendance = async () => {
            if (!selectedClassId) return;

            setLoading(true);
            try {
                // Mocking student fetch for now based on classId
                // In a real app, this would be an API call
                const mockStudents: Student[] = [
                    { id: "s1", name: "Ahmed Ali", rollNo: "101", classId: "c1" },
                    { id: "s2", name: "Sara Khan", rollNo: "102", classId: "c1" },
                    { id: "s3", name: "Zainab Noor", rollNo: "103", classId: "c2" },
                ].filter(s => s.classId === selectedClassId || selectedClassId === "all");

                setStudents(mockStudents);

                const initialAttendance: Record<string, AttendanceRecord> = {};
                mockStudents.forEach(s => {
                    initialAttendance[s.id] = { status: 'present', remarks: '' };
                });
                setAttendance(initialAttendance);
            } catch (error) {
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
        toast.success(`Marked all as ${status}`)
    }

    const handleSave = async () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Saving attendance...',
            success: 'Attendance saved successfully',
            error: 'Failed to save attendance'
        });
    }

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery)
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="teacher">
            <div className="flex flex-col gap-6 pb-24 lg:pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="heading-2 text-burgundy-gradient">Teacher Attendance</h1>
                        <p className="text-sm text-muted-foreground">Manage daily attendance for your students.</p>
                    </div>
                    <Button onClick={handleSave} className="bg-primary text-white hidden md:flex items-center gap-2">
                        <Save size={16} /> Save Attendance
                    </Button>
                </div>

                <Card className="glass-panel border-border/50">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Select Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-11">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                                    </PopoverContent>
                                </Popover>
                            </div>

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
                                <Label className="text-sm font-medium">Search Student</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Name or Roll No..." className="h-11 pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="flex-1 h-11 border-green-200 text-green-700 hover:bg-green-50" onClick={() => markAll("present")}>All Present</Button>
                                <Button variant="outline" className="flex-1 h-11 border-red-200 text-red-700 hover:bg-red-50" onClick={() => markAll("absent")}>All Absent</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel overflow-hidden border-border/50">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="heading-3 flex items-center gap-2"><Users size={20} className="text-primary" /> Student List</CardTitle>
                            <div className="flex gap-4 text-sm font-medium">
                                <span className="text-green-600">{Object.values(attendance).filter(a => a.status === 'present').length} Present</span>
                                <span className="text-red-600">{Object.values(attendance).filter(a => a.status === 'absent').length} Absent</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="w-[80px]">Roll</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-[150px]">Status</TableHead>
                                    <TableHead>Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                                    ))
                                ) : (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-primary/5">
                                            <TableCell className="text-muted-foreground font-mono text-xs">{student.rollNo}</TableCell>
                                            <TableCell className="font-semibold">{student.name}</TableCell>
                                            <TableCell>
                                                <Select value={attendance[student.id]?.status} onValueChange={(val) => handleStatusChange(student.id, val as AttendanceStatus)}>
                                                    <SelectTrigger className={cn(
                                                        "h-9 text-xs font-bold",
                                                        attendance[student.id]?.status === "present" && "bg-green-50 text-green-700 border-green-200",
                                                        attendance[student.id]?.status === "absent" && "bg-red-50 text-red-700 border-red-200",
                                                        attendance[student.id]?.status === "late" && "bg-amber-50 text-amber-700 border-amber-200"
                                                    )}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="present">Present</SelectItem>
                                                        <SelectItem value="absent">Absent</SelectItem>
                                                        <SelectItem value="late">Late</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare size={14} className="text-muted-foreground" />
                                                    <Input placeholder="Note..." className="h-9 text-xs" value={attendance[student.id]?.remarks} onChange={(e) => handleRemarksChange(student.id, e.target.value)} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t bg-background/80 md:hidden backdrop-blur">
                    <Button onClick={handleSave} className="w-full h-12 bg-primary text-white"><Save size={18} className="mr-2" /> Save Attendance</Button>
                </div>
            </div>
        </AppLayout>
    )
}
