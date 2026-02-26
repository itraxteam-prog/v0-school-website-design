"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter,
    UserPlus,
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

const studentSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    rollNo: z.string().min(4, { message: "Roll number must be at least 4 characters." }),
    classId: z.string().min(1, { message: "Please select a class." }),
    dob: z.string().min(1, { message: "Please select date of birth." }),
    guardianPhone: z.string().min(10, { message: "Invalid contact number." }),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
})

type StudentFormValues = z.infer<typeof studentSchema>

interface Student extends StudentFormValues {
    id: string;
}

interface StudentsManagerProps {
    initialStudents: any[];
}

export function StudentsManager({ initialStudents }: StudentsManagerProps) {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Pagination State
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [totalStudents, setTotalStudents] = useState(0)

    const { data: session } = useSession()
    const { toast } = useToast()

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: "",
            rollNo: "",
            classId: "",
            dob: "",
            guardianPhone: "",
            address: "",
        },
    })

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const url = `/api/admin/students?page=${page}&limit=${limit}&search=${searchTerm}`
            const res = await fetch(url, { credentials: "include" })
            if (!res.ok) throw new Error("Failed to fetch students")
            const result = await res.json()
            
            setStudents(result.data.map((s: any) => ({
                id: s.id,
                name: s.name || "",
                rollNo: s.profile?.rollNumber || `S-${s.id.split('-')[0].toUpperCase()}`,
                classId: s.profile?.class || "N/A",
                dob: s.profile?.dateOfBirth || "",
                guardianPhone: s.profile?.guardianPhone || "",
                address: s.profile?.address || ""
            })))
            
            setTotalPages(result.pagination?.pages || 1)
            setTotalStudents(result.pagination?.total || result.data.length)
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }, [page, searchTerm, limit])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    useEffect(() => {
        if (editingStudent) {
            form.reset(editingStudent)
        } else {
            form.reset({
                name: "",
                rollNo: "",
                classId: "",
                dob: "",
                guardianPhone: "",
                address: "",
            })
        }
    }, [editingStudent, form])


    const onSubmit = async (data: StudentFormValues) => {
        setIsSubmitting(true)
        try {
            const url = editingStudent ? `/api/admin/students/${editingStudent.id}` : "/api/admin/students"
            const method = editingStudent ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, email: `${data.rollNo.toLowerCase()}@school.edu` }) // Simulated email logic
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "Operation failed")
            }

            toast({
                title: "Success",
                description: `Student ${editingStudent ? 'updated' : 'added'} successfully.`,
            })

            fetchStudents() // Refresh list
            setIsModalOpen(false)
            setEditingStudent(null)
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

    const handleDelete = async (student: Student) => {
        if (!confirm(`Are you sure you want to delete ${student.name}?`)) return

        try {
            const res = await fetch(`/api/admin/students/${student.id}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "Failed to delete")
            }
            setStudents(prev => prev.filter(s => s.id !== student.id));
            toast({
                title: "Deleted",
                description: "Student has been removed.",
            })
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        }
    }

    const filteredStudents = (students || []).filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName={session?.user?.name || "Admin"} userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="heading-1 text-burgundy-gradient">Student Management</h1>
                            <p className="text-sm text-muted-foreground">Monitor enrollment, academics, and student records.</p>
                        </div>

                        <Dialog open={isModalOpen} onOpenChange={(open) => {
                            setIsModalOpen(open)
                            if (!open) setEditingStudent(null)
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                    <UserPlus className="h-4 w-4" />
                                    Add New Student
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="heading-3">{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
                                    <DialogDescription>
                                        {editingStudent ? 'Update the student details below.' : 'Enter the student details below to register them in the system.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="John Doe" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="rollNo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Roll Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="2025-XXXX" {...field} className="glass-card" />
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
                                                                <SelectItem value="cls-001">10-A</SelectItem>
                                                                <SelectItem value="cls-002">9-B</SelectItem>
                                                                <SelectItem value="cls-003">8-C</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dob"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date of Birth</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="guardianPhone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Guardian Phone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+92 XXX XXXXXXX" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="123 Street, City" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow min-w-[120px]">
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingStudent ? 'Update Student' : 'Save Student')}
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
                                placeholder="Search by name or roll number..."
                                className="h-11 pl-9 glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" onClick={fetchStudents} className="h-11 w-11 glass-card">
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-11 w-[140px] glass-card">
                                    <SelectValue placeholder="All Classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    <SelectItem value="10-A">10-A</SelectItem>
                                    <SelectItem value="10-B">10-B</SelectItem>
                                    <SelectItem value="9-A">9-A</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
                                <Filter className="h-4 w-4" />
                                More Filters
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
                                        <Skeleton key={i} className="h-16 w-full" />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">Failed to load data</h3>
                                        <p className="text-muted-foreground">{error}</p>
                                    </div>
                                    <Button onClick={fetchStudents} variant="outline" className="gap-2">
                                        <RefreshCcw className="h-4 w-4" /> Try Again
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-border/50 hover:bg-transparent">
                                                <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Name</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Roll No</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Class ID</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">DOB</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Guardian Phone</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Address</TableHead>
                                                <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student) => (
                                                    <TableRow
                                                        key={student.id}
                                                        className="border-border/50 transition-colors hover:bg-primary/5 group"
                                                    >
                                                        <TableCell className="pl-6 font-semibold text-foreground py-4">{student.name}</TableCell>
                                                        <TableCell className="font-medium">
                                                            <span className="bg-primary/5 text-primary px-2 py-1 rounded text-xs font-bold">
                                                                {student.rollNo}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4 font-medium text-muted-foreground">{student.classId}</TableCell>
                                                        <TableCell className="py-4 text-muted-foreground">{student.dob}</TableCell>
                                                        <TableCell className="py-4 text-muted-foreground">{student.guardianPhone}</TableCell>
                                                        <TableCell className="py-4 text-muted-foreground max-w-[200px] truncate">{student.address}</TableCell>
                                                        <TableCell className="pr-6 text-right py-4">
                                                            <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" onClick={() => { setEditingStudent(student); setIsModalOpen(true); }} className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(student)} className="h-8 w-8 hover:text-destructive hover:bg-destructive/10">
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                            <div className="md:hidden">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                            <MoreVertical size={16} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="glass-panel border-border/50">
                                                                        <DropdownMenuItem onClick={() => { setEditingStudent(student); setIsModalOpen(true); }} className="flex items-center gap-2 cursor-pointer">
                                                                            <Edit size={14} /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDelete(student)} className="flex items-center gap-2 cursor-pointer text-destructive">
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
                                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                        {searchTerm ? "No students found matching your search." : "No students registered yet."}
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

                <AnimatedWrapper delay={0.3}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-xs text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{Math.min((page - 1) * limit + 1, totalStudents)}-{Math.min(page * limit, totalStudents)}</span> of <span className="font-semibold text-foreground">{totalStudents}</span> students
                        </p>
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 glass-card" 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 w-9 bg-primary text-white hover:bg-primary/90 rounded-md">{page}</Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 glass-card"
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </AnimatedWrapper>

            </div>
        </AppLayout>
    )
}
