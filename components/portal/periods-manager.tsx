"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Plus,
    Clock,
    Loader2,
    AlertCircle,
    RefreshCcw,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AppLayout } from "@/components/layout/app-layout"
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const periodSchema = z.object({
    name: z.string().min(2, { message: "Period name must be at least 2 characters." }),
    classId: z.string().min(1, { message: "Please select a class." }),
    teacherId: z.string().min(1, { message: "Please select a teacher." }),
    dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
    startTime: z.string().min(1, { message: "Please enter start time." }),
    endTime: z.string().min(1, { message: "Please enter end time." }),
    room: z.string().optional(),
})

type PeriodFormValues = z.infer<typeof periodSchema>

interface Period extends PeriodFormValues {
    id: string;
    class?: { name: string };
    teacher?: { name: string };
}

interface ClassRecord {
    id: string;
    name: string;
}

interface TeacherRecord {
    id: string;
    name: string;
}

interface PeriodsManagerProps {
    initialPeriods: any[];
    initialClasses: ClassRecord[];
    initialTeachers: TeacherRecord[];
}

export function PeriodsManager({ initialPeriods, initialClasses, initialTeachers }: PeriodsManagerProps) {
    const [periods, setPeriods] = useState<Period[]>(initialPeriods.map(p => ({
        id: p.id,
        name: p.subjectName || "",
        classId: p.classId || "",
        teacherId: p.teacherId || "",
        dayOfWeek: p.dayOfWeek || "MONDAY",
        startTime: p.startTime || "08:30",
        endTime: p.endTime || "09:30",
        room: p.room || "",
        class: p.class,
        teacher: p.teacher,
    })))
    const [classes] = useState<ClassRecord[]>(initialClasses)
    const [teachers] = useState<TeacherRecord[]>(initialTeachers)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPeriod, setEditingPeriod] = useState<Period | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()

    const form = useForm<PeriodFormValues>({
        resolver: zodResolver(periodSchema),
        defaultValues: {
            name: "",
            classId: "",
            teacherId: "",
            dayOfWeek: "MONDAY",
            startTime: "",
            endTime: "",
            room: "",
        },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/admin/timetable")
            if (!response.ok) throw new Error("Failed to fetch timetable")
            const data = await response.json()
            setPeriods(data.map((p: any) => ({
                id: p.id,
                name: p.subjectName || "",
                classId: p.classId || "",
                teacherId: p.teacherId || "",
                dayOfWeek: p.dayOfWeek || "MONDAY",
                startTime: p.startTime || "08:30",
                endTime: p.endTime || "09:30",
                room: p.room || "",
                class: p.class,
                teacher: p.teacher,
            })))
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (editingPeriod) {
            form.reset({
                name: editingPeriod.name,
                classId: editingPeriod.classId,
                teacherId: editingPeriod.teacherId,
                dayOfWeek: editingPeriod.dayOfWeek,
                startTime: editingPeriod.startTime,
                endTime: editingPeriod.endTime,
                room: editingPeriod.room || "",
            })
        } else {
            form.reset({
                name: "",
                classId: "",
                teacherId: "",
                dayOfWeek: "MONDAY",
                startTime: "",
                endTime: "",
                room: "",
            })
        }
    }, [editingPeriod, form])

    const onSubmit = async (data: PeriodFormValues) => {
        setIsSubmitting(true)
        try {
            const url = editingPeriod
                ? `/api/admin/timetable/${editingPeriod.id}`
                : "/api/admin/timetable"

            const response = await fetch(url, {
                method: editingPeriod ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    subjectName: data.name, // Map UI 'name' to DB 'subjectName'
                }),
            })

            if (!response.ok) throw new Error("Failed to save period")

            toast({
                title: "Success",
                description: `Period ${editingPeriod ? 'updated' : 'created'} successfully.`,
            })

            setIsModalOpen(false)
            setEditingPeriod(null)
            fetchData() // Refresh list
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (period: Period) => {
        if (!confirm(`Are you sure you want to delete this period: ${period.name}?`)) return

        try {
            const response = await fetch(`/api/admin/timetable/${period.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete period")

            toast({
                title: "Deleted",
                description: "Period has been removed.",
            })
            fetchData() // Refresh list
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        }
    }

    const getClassName = (classId: string, period?: Period) => {
        if (period?.class?.name) return period.class.name
        const classRecord = classes.find(c => c.id === classId)
        return classRecord ? classRecord.name : "Unknown Class"
    }

    const getTeacherName = (teacherId: string, period?: Period) => {
        if (period?.teacher?.name) return period.teacher.name
        const teacherRecord = teachers.find(t => t.id === teacherId)
        return teacherRecord ? teacherRecord.name : "Unknown Teacher"
    }

    const filteredPeriods = (periods || []).filter(period =>
        period.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getClassName(period.classId, period).toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="heading-1 text-burgundy-gradient">Periods & Timetable</h1>
                            <p className="text-sm text-muted-foreground">Manage school periods, durations, and class associations.</p>
                        </div>

                        <Dialog open={isModalOpen} onOpenChange={(open) => {
                            setIsModalOpen(open)
                            if (!open) setEditingPeriod(null)
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                    <Plus className="h-4 w-4" />
                                    Add New Period
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="heading-3">{editingPeriod ? 'Edit Period' : 'Add Period'}</DialogTitle>
                                    <DialogDescription>
                                        {editingPeriod ? 'Update the period details below.' : 'Configure a new class period and schedule.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Period Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Mathematics" {...field} className="glass-card" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="classId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Class</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="glass-card">
                                                                <SelectValue placeholder="Select class" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {classes.map((c) => (
                                                                <SelectItem key={c.id} value={c.id}>
                                                                    {c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="teacherId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Teacher</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="glass-card">
                                                                <SelectValue placeholder="Select teacher" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {teachers.map((t) => (
                                                                <SelectItem key={t.id} value={t.id}>
                                                                    {t.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dayOfWeek"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Day of Week</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="glass-card">
                                                                <SelectValue placeholder="Select day" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="MONDAY">Monday</SelectItem>
                                                            <SelectItem value="TUESDAY">Tuesday</SelectItem>
                                                            <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                                                            <SelectItem value="THURSDAY">Thursday</SelectItem>
                                                            <SelectItem value="FRIDAY">Friday</SelectItem>
                                                            <SelectItem value="SATURDAY">Saturday</SelectItem>
                                                            <SelectItem value="SUNDAY">Sunday</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="room"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Room (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Room 101" {...field} className="glass-card" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="startTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Start Time</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="endTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>End Time</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow min-w-[120px]">
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingPeriod ? 'Update' : 'Create')}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.1}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by subject or class..."
                                className="h-11 pl-9 glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" onClick={fetchData} className="h-11 w-11 glass-card">
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.2}>
                    <Card className="glass-panel border-border/50 overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-6 space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton className="h-16 w-full" key={i} />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Failed to load data</h3>
                                    <Button onClick={fetchData} variant="outline" className="gap-2">
                                        <RefreshCcw className="h-4 w-4" /> Try Again
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-border/50 hover:bg-transparent">
                                                <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Subject</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Class</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Teacher</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Day</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Time Slot</TableHead>
                                                <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPeriods.length > 0 ? (
                                                filteredPeriods.map((period) => (
                                                    <TableRow key={period.id} className="border-border/50 transition-colors hover:bg-primary/5 group">
                                                        <TableCell className="pl-6 font-semibold py-4">{period.name}</TableCell>
                                                        <TableCell className="py-4 font-medium text-primary">
                                                            {getClassName(period.classId, period)}
                                                        </TableCell>
                                                        <TableCell className="py-4 font-medium">
                                                            {getTeacherName(period.teacherId, period)}
                                                        </TableCell>
                                                        <TableCell className="py-4 font-medium text-muted-foreground">
                                                            {period.dayOfWeek}
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                                <Clock size={14} className="text-primary/70" />
                                                                {period.startTime} - {period.endTime}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right py-4">
                                                            <div className="hidden md:flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" onClick={() => { setEditingPeriod(period); setIsModalOpen(true); }} className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(period)} className="h-8 w-8 hover:text-destructive hover:bg-destructive/10">
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                            <div className="flex justify-end md:hidden">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                            <MoreVertical size={16} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="glass-panel border-border/50">
                                                                        <DropdownMenuItem onClick={() => { setEditingPeriod(period); setIsModalOpen(true); }} className="flex items-center gap-2 cursor-pointer">
                                                                            <Edit size={14} /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDelete(period)} className="flex items-center gap-2 cursor-pointer text-destructive">
                                                                            <Trash2 size={14} /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                        No periods found.
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
