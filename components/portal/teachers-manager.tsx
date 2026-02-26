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

const teacherSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    employeeId: z.string().min(4, { message: "Employee ID must be at least 4 characters." }),
    department: z.string().min(1, { message: "Please enter department." }),
    classIds: z.string().min(1, { message: "Please enter assigned class IDs (comma separated)." }),
})

type TeacherFormValues = z.infer<typeof teacherSchema>

interface Teacher extends TeacherFormValues {
    id: string;
    _id?: string;
}

interface TeachersManagerProps {
    initialTeachers: any[];
}

export function TeachersManager({ initialTeachers }: TeachersManagerProps) {
    // Transform initial data if necessary
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers.map(t => ({
        id: t.id,
        name: t.name || "",
        employeeId: t.employeeId || `T-${t.id.split('-')[0].toUpperCase()}`,
        department: t.department || "Faculty",
        classIds: typeof t.classIds === 'string' ? t.classIds : (Array.isArray(t.classIds) ? t.classIds.join(', ') : "N/A")
    })))

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Pagination State
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalTeachers, setTotalTeachers] = useState(0)
    const limit = 10

    const { data: session } = useSession()
    const { toast } = useToast()

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            name: "",
            employeeId: "",
            department: "",
            classIds: "",
        },
    })

    const fetchTeachers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const url = `/api/admin/teachers?page=${page}&limit=${limit}&search=${searchTerm}`
            const res = await fetch(url, { credentials: "include" })
            if (!res.ok) throw new Error("Failed to fetch teachers")
            const result = await res.json()
            
            setTeachers(result.data.map((t: any) => ({
                id: t.id,
                name: t.name || "",
                employeeId: t.profile?.rollNumber || `T-${t.id.split('-')[0].toUpperCase()}`,
                department: t.department || "Faculty",
                classIds: "N/A"
            })))
            
            setTotalPages(result.pagination?.pages || 1)
            setTotalTeachers(result.pagination?.total || result.data.length)
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }, [page, searchTerm])

    useEffect(() => {
        fetchTeachers()
    }, [fetchTeachers])


    useEffect(() => {
        if (editingTeacher) {
            form.reset({
                name: editingTeacher.name,
                employeeId: editingTeacher.employeeId,
                department: editingTeacher.department,
                classIds: editingTeacher.classIds,
            })
        } else {
            form.reset({
                name: "",
                employeeId: "",
                department: "",
                classIds: "",
            })
        }
    }, [editingTeacher, form])
    const onSubmit = async (data: TeacherFormValues) => {
        setIsSubmitting(true)
        try {

            const url = editingTeacher ? `/api/admin/teachers/${editingTeacher.id}` : "/api/admin/teachers"
            const method = editingTeacher ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, email: `${data.name.split(' ')[0].toLowerCase()}@school.edu` })
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "Operation failed")
            }

            toast({
                title: "Success",
                description: `Teacher ${editingTeacher ? 'updated' : 'added'} successfully.`,
            })

            fetchTeachers()
            setIsModalOpen(false)
            setEditingTeacher(null)
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

    const handleDelete = async (teacher: Teacher) => {
        if (!confirm(`Are you sure you want to delete ${teacher.name}?`)) return

        try {
            const res = await fetch(`/api/admin/teachers/${teacher.id}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "Failed to delete")
            }
            setTeachers(prev => prev.filter(t => t.id !== teacher.id));
            toast({
                title: "Deleted",
                description: "Teacher has been removed.",
            })
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        }
    }

    const filteredTeachers = (teachers || []).filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName={session?.user?.name || "Admin"} userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="heading-1 text-burgundy-gradient">Teacher Management</h1>
                            <p className="text-sm text-muted-foreground">Manage faculty records, assignments, and schedules.</p>
                        </div>

                        <Dialog open={isModalOpen} onOpenChange={(open) => {
                            setIsModalOpen(open)
                            if (!open) setEditingTeacher(null)
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                    <UserPlus className="h-4 w-4" />
                                    Add New Teacher
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="heading-3">{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
                                    <DialogDescription>
                                        {editingTeacher ? 'Update the faculty member details below.' : 'Enter official teacher details below to add them to the faculty list.'}
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
                                                            <Input placeholder="Dr. Sarah Johnson" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="employeeId"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Employee ID</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="T-2024-XXXX" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="department"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Department</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Mathematics, Physics" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="classIds"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Assigned Class IDs</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="cls-001, cls-002" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow min-w-[120px]">
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingTeacher ? 'Update Record' : 'Add Teacher')}
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
                                placeholder="Search by name or employee ID..."
                                className="h-11 pl-9 glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" onClick={fetchTeachers} className="h-11 w-11 glass-card">
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-11 w-[150px] glass-card">
                                    <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    <SelectItem value="math">Mathematics</SelectItem>
                                    <SelectItem value="physics">Physics</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
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
                                    <Button onClick={fetchTeachers} variant="outline" className="gap-2">
                                        <RefreshCcw className="h-4 w-4" /> Try Again
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-border/50 hover:bg-transparent">
                                                <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Name</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Employee ID</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Department</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Assigned Classes</TableHead>
                                                <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTeachers.length > 0 ? (
                                                filteredTeachers.map((teacher) => (
                                                    <TableRow
                                                        key={teacher.id}
                                                        className="border-border/50 transition-colors hover:bg-primary/5 group"
                                                    >
                                                        <TableCell className="pl-6 font-semibold text-foreground py-4">{teacher.name}</TableCell>
                                                        <TableCell className="font-medium">
                                                            <span className="bg-primary/5 text-primary px-2 py-1 rounded text-xs font-bold">
                                                                {teacher.employeeId}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-muted-foreground font-medium">{teacher.department}</TableCell>
                                                        <TableCell className="py-4 text-muted-foreground">
                                                            <div className="flex flex-wrap gap-1">
                                                                {teacher.classIds.split(',').map((cls, idx) => (
                                                                    <Badge key={idx} variant="secondary" className="bg-muted/50 text-[10px] h-5">
                                                                        {cls.trim()}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right py-4">
                                                            <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" onClick={() => { setEditingTeacher(teacher); setIsModalOpen(true); }} className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher)} className="h-8 w-8 hover:text-destructive hover:bg-destructive/10">
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
                                                                        <DropdownMenuItem onClick={() => { setEditingTeacher(teacher); setIsModalOpen(true); }} className="flex items-center gap-2 cursor-pointer">
                                                                            <Edit size={14} /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDelete(teacher)} className="flex items-center gap-2 cursor-pointer text-destructive">
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
                                                        {searchTerm ? "No teachers found matching your search." : "No faculty members registered yet."}
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
                            Showing <span className="font-semibold text-foreground">{Math.min((page - 1) * limit + 1, totalTeachers)}-{Math.min(page * limit, totalTeachers)}</span> of <span className="font-semibold text-foreground">{totalTeachers}</span> faculty members
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
