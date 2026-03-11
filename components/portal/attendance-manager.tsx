"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    ShieldCheck,
    Calendar as CalendarIcon,
    Search,
    Save,
    Users,
    Loader2,
    MessageSquare
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileCardView } from "@/components/ui/mobile-card-view"


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
    const router = useRouter()
    const isMobile = useIsMobile()
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id || "")
    const [date, setDate] = useState<Date>(new Date())
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { data: session } = useSession()
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})

    useEffect(() => {
        const fetchStudentsAndAttendance = async () => {
            if (!selectedClassId) return;

            setLoading(true);
            try {
                const [studentsRes, attendanceRes] = await Promise.all([
                    fetch(`/api/teacher/students?classId=${selectedClassId}`, { credentials: "include" }),
                    fetch(`/api/teacher/attendance?classId=${selectedClassId}&date=${date.toISOString()}`, { credentials: "include" })
                ]);

                if (studentsRes.ok) {
                    const studentsResult = await studentsRes.json();
                    const fetchedStudents: Student[] = studentsResult.data || [];
                    setStudents(fetchedStudents);

                    const initialAttendance: Record<string, AttendanceRecord> = {};

                    // Default to present for all fetched students
                    fetchedStudents.forEach(s => {
                        initialAttendance[s.id] = { status: 'present', remarks: '' };
                    });

                    // Merge with existing attendance from DB if any
                    if (attendanceRes.ok) {
                        const attendanceResult = await attendanceRes.json();
                        const existingRecords: any[] = attendanceResult.data || [];

                        existingRecords.forEach(rec => {
                            if (initialAttendance[rec.studentId]) {
                                initialAttendance[rec.studentId] = {
                                    status: rec.status.toLowerCase() as AttendanceStatus,
                                    remarks: rec.remarks || ''
                                };
                            }
                        });
                    }

                    setAttendance(initialAttendance);
                } else {
                    toast.error("Failed to load student data");
                }


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
        if (students.length === 0) {
            toast.error("No students to save attendance for.");
            return;
        }

        const records = students.map(s => ({
            studentId: s.id,
            status: attendance[s.id]?.status || "present",
            remarks: attendance[s.id]?.remarks || "",
        }));

        const savePromise = fetch("/api/teacher/attendance", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                classId: selectedClassId,
                date: date.toISOString(),
                records,
            }),
        }).then(async (res) => {
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to save attendance");
            }
            return res.json();
        });

        toast.promise(savePromise, {
            loading: "Saving attendance...",
            success: "Attendance saved successfully",
            error: (err) => err.message || "Failed to save attendance",
        });

        savePromise.then(() => router.refresh());
    }

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery)
    )

    return (
        <div className={`p-4 sm:p-6 space-y-6 ${isMobile ? 'pb-24' : ''}`}>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Attendance</h1>
                        <p className="text-sm text-muted-foreground">Manage daily attendance for your students.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <SummaryCard title="Present" count={Object.values(attendance).filter(a => a.status === 'present').length} icon={CheckCircle2} color="green" />
                    <SummaryCard title="Absent" count={Object.values(attendance).filter(a => a.status === 'absent').length} icon={XCircle} color="red" />
                    <SummaryCard title="Late" count={Object.values(attendance).filter(a => a.status === 'late').length} icon={AlertCircle} color="amber" />
                    <SummaryCard title="Excused" count={Object.values(attendance).filter(a => a.status === 'excused').length} icon={ShieldCheck} color="blue" />
                </div>

                <Card className="glass-panel border-border/50">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Select Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-10 glass-card">
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
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Class</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="h-10 glass-card"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {initialClasses.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Name or Roll No..." className="h-10 pl-9 glass-card" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>

                            <Button onClick={handleSave} className="h-10 bg-primary text-white shadow-burgundy-glow/20">
                                <Save size={16} className="mr-2" /> Save Changes
                            </Button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <QuickMarkButton label="All Present" onClick={() => markAll("present")} color="green" />
                            <QuickMarkButton label="All Absent" onClick={() => markAll("absent")} color="red" />
                            <QuickMarkButton label="All Late" onClick={() => markAll("late")} color="amber" />
                            <QuickMarkButton label="All Excused" onClick={() => markAll("excused")} color="blue" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel overflow-hidden border-border/50">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2"><Users size={18} className="text-primary" /> Student List</CardTitle>
                            <Badge variant="secondary" className="rounded-full">{filteredStudents.length} {isMobile ? '' : 'Students'}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className={cn("p-0", isMobile && "p-4 bg-secondary/30")}>
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
                                        label: "STATUS", key: "status", render: (_, s) => (
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {["present", "absent", "late", "excused"].map((st) => (
                                                    <Button
                                                        key={st}
                                                        variant="outline"
                                                        className={cn(
                                                            "h-10 text-[10px] uppercase font-bold tracking-wider rounded-xl",
                                                            attendance[s.id]?.status === st ?
                                                                (st === "present" ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20" :
                                                                    st === "absent" ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" :
                                                                        st === "late" ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" :
                                                                            "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20")
                                                                : "bg-background text-muted-foreground border-border/50"
                                                        )}
                                                        onClick={() => handleStatusChange(s.id, st as AttendanceStatus)}
                                                    >
                                                        {st}
                                                    </Button>
                                                ))}
                                            </div>
                                        )
                                    },
                                    {
                                        label: "REMARKS", key: "remarks", render: (_, s) => (
                                            <div className="flex items-center gap-2 mt-2 group focus-within:ring-2 ring-primary/20 rounded-xl transition-all">
                                                <MessageSquare size={14} className="text-muted-foreground ml-2" />
                                                <Input
                                                    placeholder="Add private note..."
                                                    className="border-none bg-transparent h-10 shadow-none text-xs"
                                                    value={attendance[s.id]?.remarks}
                                                    onChange={(e) => handleRemarksChange(s.id, e.target.value)}
                                                />
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow>
                                        <TableHead className="w-[100px] pl-6 uppercase text-[10px] font-bold">Roll</TableHead>
                                        <TableHead className="uppercase text-[10px] font-bold">Student Name</TableHead>
                                        <TableHead className="w-[180px] uppercase text-[10px] font-bold">Status</TableHead>
                                        <TableHead className="pr-6 uppercase text-[10px] font-bold">Remarks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-primary/5 transition-colors">
                                            <TableCell className="pl-6 text-muted-foreground font-mono text-xs">{student.rollNo}</TableCell>
                                            <TableCell className="font-semibold">{student.name}</TableCell>
                                            <TableCell>
                                                <Select value={attendance[student.id]?.status} onValueChange={(val) => handleStatusChange(student.id, val as AttendanceStatus)}>
                                                    <SelectTrigger className={cn(
                                                        "h-9 text-xs font-bold transition-all",
                                                        attendance[student.id]?.status === "present" && "bg-green-50 text-green-700 border-green-200",
                                                        attendance[student.id]?.status === "absent" && "bg-red-50 text-red-700 border-red-200",
                                                        attendance[student.id]?.status === "late" && "bg-amber-50 text-amber-700 border-amber-200",
                                                        attendance[student.id]?.status === "excused" && "bg-blue-50 text-blue-700 border-blue-200"
                                                    )}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="present">Present</SelectItem>
                                                        <SelectItem value="absent">Absent</SelectItem>
                                                        <SelectItem value="late">Late</SelectItem>
                                                        <SelectItem value="excused">Excused</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="pr-6">
                                                <div className="flex items-center gap-2 border border-transparent focus-within:border-primary/30 focus-within:bg-background rounded-md px-2 transition-all">
                                                    <MessageSquare size={14} className="text-muted-foreground" />
                                                    <Input
                                                        placeholder="Note..."
                                                        className="border-none bg-transparent h-9 shadow-none text-xs"
                                                        value={attendance[student.id]?.remarks}
                                                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
        </div>
    );
}

function SummaryCard({ title, count, icon: Icon, color }: any) {
    const colors: any = {
        green: "bg-green-100 text-green-600 border-green-200",
        red: "bg-red-100 text-red-600 border-red-200",
        amber: "bg-amber-100 text-amber-600 border-amber-200",
        blue: "bg-blue-100 text-blue-600 border-blue-200"
    }
    return (
        <Card className="glass-panel overflow-hidden border-border/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{title}</p>
                        <p className={cn("mt-1 text-2xl font-bold",
                            color === 'green' ? 'text-green-600' :
                                color === 'red' ? 'text-red-600' :
                                    color === 'amber' ? 'text-amber-600' : 'text-blue-600'
                        )}>{count}</p>
                    </div>
                    <div className={cn("rounded-xl p-2", colors[color])}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function QuickMarkButton({ label, onClick, color }: any) {
    const colors: any = {
        green: "border-green-200 text-green-700 hover:bg-green-50",
        red: "border-red-200 text-red-700 hover:bg-red-50",
        amber: "border-amber-200 text-amber-700 hover:bg-amber-50",
        blue: "border-blue-200 text-blue-700 hover:bg-blue-50"
    }
    return (
        <Button variant="outline" className={cn("h-10 text-[10px] font-bold uppercase tracking-tight glass-card", colors[color])} onClick={onClick}>
            {label}
        </Button>
    )
}
