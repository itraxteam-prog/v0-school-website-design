"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
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
    Search,
    Edit,
    Trash2,
    Plus,
    FileText,
    Calendar,
    Users,
    ChevronRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    RefreshCcw,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AppLayout } from "@/components/layout/app-layout"
import { TEACHER_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const assignmentSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().optional(),
    dueDate: z.string().min(1, { message: "Please select a due date." }),
    maxPoints: z.string().min(1, { message: "Please enter max points." }),
    classId: z.string().min(1, { message: "Please select a class." }),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
    classId: string;
    class?: { name: string };

}

interface AssignmentsManagerProps {
    initialClasses: any[];
}

export function AssignmentsManager({ initialClasses }: AssignmentsManagerProps) {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm<AssignmentFormValues>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: "",
            maxPoints: "100",
            classId: initialClasses[0]?.id || "",
        },
    })

    const fetchAssignments = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/teacher/assignments")
            if (!res.ok) throw new Error("Failed to fetch assignments")
            const data = await res.json()
            setAssignments(data)
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAssignments()
    }, [fetchAssignments])

    const onSubmit = async (data: AssignmentFormValues) => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/teacher/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) throw new Error("Failed to create assignment")

            toast({
                title: "Success",
                description: "Assignment created successfully.",
            })

            setIsModalOpen(false)
            form.reset()
            fetchAssignments()
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

    const filteredAssignments = assignments.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.class?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Teacher" userRole="teacher">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="heading-1 text-burgundy-gradient">Assignments</h1>
                            <p className="text-sm text-muted-foreground">Manage your class assignments and student submissions.</p>
                        </div>

                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                    <Plus className="h-4 w-4" />
                                    New Assignment
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="heading-3">Create Assignment</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details for the new class assignment.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Assignment Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Midterm Research Project" {...field} className="glass-card" />
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="glass-card">
                                                                <SelectValue placeholder="Select class" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {initialClasses.map((c) => (
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
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="dueDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Due Date</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxPoints"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Max Points</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Instructions (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Describe the assignment..." {...field} className="glass-card" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow min-w-[120px]">
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create'}
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
                                placeholder="Search by title or class..."
                                className="h-11 pl-9 glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={fetchAssignments} className="h-11 w-11 glass-card">
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.2}>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-48 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center gap-4 glass-panel border-border/50">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <h3 className="font-semibold">{error}</h3>
                            <Button onClick={fetchAssignments} variant="outline" className="gap-2">
                                <RefreshCcw className="h-4 w-4" /> Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAssignments.length > 0 ? (
                                filteredAssignments.map((a) => (
                                    <Card key={a.id} className="glass-panel border-border/50 hover:shadow-burgundy-glow transition-all duration-300">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <Badge className="bg-primary/10 text-primary border-none">
                                                    {a.class?.name}
                                                </Badge>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                                                </div>
                                            </div>
                                            <CardTitle className="heading-3 mt-2">{a.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar size={14} />
                                                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle2 size={14} />
                                                    <span>{a.maxMarks} Points</span>
                                                </div>
                                            </div>
                                            <div className="pt-2 flex items-center justify-end border-t border-border/50">
                                                <Button variant="link" className="text-primary p-0 h-auto text-xs font-bold gap-1">
                                                    Details <ChevronRight size={12} />
                                                </Button>
                                            </div>

                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center glass-panel border-border/50">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No assignments found.</p>
                                    <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>Create your first assignment</Button>
                                </div>
                            )}
                        </div>
                    )}
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}
