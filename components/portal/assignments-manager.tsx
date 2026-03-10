"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
    AlertCircle,
    RefreshCcw,
    Eye,
    ExternalLink,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AppLayout } from "@/components/layout/app-layout"
import { useSession } from "next-auth/react"
import { TEACHER_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const assignmentSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().optional(),
    dueDate: z.string().min(1, { message: "Please select a due date." }),
    maxPoints: z.string().optional(),
    classId: z.string().min(1, { message: "Please select a class." }),
    subject: z.string().optional(),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number | null;
    classId: string;
    subject?: string;
    class?: { name: string };
    _count?: { submissions: number };
}

interface AssignmentsManagerProps {
    initialClasses: any[];
}

export function AssignmentsManager({ initialClasses }: AssignmentsManagerProps) {
    const router = useRouter()
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [viewingSubmissions, setViewingSubmissions] = useState<Assignment | null>(null)
    const [submissions, setSubmissions] = useState<any[]>([])
    const [submissionsLoading, setSubmissionsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<AssignmentFormValues>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: "",
            maxPoints: "",
            classId: initialClasses[0]?.id || "",
            subject: "",
        },
    })

    const selectedClassId = form.watch("classId")
    const selectedClass = initialClasses.find(c => c.id === selectedClassId)
    const classSubjects = selectedClass?.subjects?.split(',').map((s: string) => s.trim()) || []

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

    const openSubmissions = async (a: Assignment) => {
        setViewingSubmissions(a)
        setSubmissionsLoading(true)
        try {
            const res = await fetch(`/api/teacher/assignments/${a.id}/submissions`)
            if (!res.ok) throw new Error("Failed to fetch submissions")
            const data = await res.json()
            setSubmissions(data)
        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to load submissions.",
                variant: "destructive",
            })
        } finally {
            setSubmissionsLoading(false)
        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [fetchAssignments])

    const onSubmit = async (data: AssignmentFormValues) => {
        setIsSubmitting(true)
        try {
            const body = {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                maxMarks: data.maxPoints ? parseFloat(data.maxPoints) : null,
                classId: data.classId,
                subject: data.subject
            }
            const res = await fetch("/api/teacher/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (!res.ok) throw new Error("Failed to create assignment")

            toast({
                title: "Success",
                description: "Assignment created successfully.",
            })

            setIsModalOpen(false)
            form.reset()
            router.refresh()
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

    const { data: session } = useSession()

    return (
        <AppLayout
            sidebarItems={sidebarItems}
            userName={session?.user?.name || "Teacher"}
            userRole="teacher"
            userImage={session?.user?.image || undefined}
        >
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
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="classId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Class</FormLabel>
                                                        <Select onValueChange={(val) => {
                                                            field.onChange(val);
                                                            form.setValue("subject", ""); // Reset subject when class changes
                                                        }} defaultValue={field.value}>
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
                                            <FormField
                                                control={form.control}
                                                name="subject"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Subject</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="glass-card">
                                                                    <SelectValue placeholder="Select subject" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {classSubjects.length > 0 ? (
                                                                    classSubjects.map((s: string, idx: number) => (
                                                                        <SelectItem key={idx} value={s}>
                                                                            {s}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem value="General" disabled>No subjects found</SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
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
                                            <div className="flex flex-wrap gap-2 justify-between items-start">
                                                <div className="flex gap-2">
                                                    <Badge className="bg-primary/10 text-primary border-none">
                                                        {a.class?.name}
                                                    </Badge>
                                                    {a.subject && (
                                                        <Badge variant="outline" className="text-[10px] h-5 py-0">
                                                            {a.subject}
                                                        </Badge>
                                                    )}
                                                </div>
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
                                                    <span>{a.maxMarks ? `${a.maxMarks} Points` : 'Ungraded Task'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users size={14} />
                                                    <span>{a._count?.submissions || 0} Submissions</span>
                                                </div>
                                            </div>
                                            <div className="pt-2 flex items-center justify-between border-t border-border/50">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary hover:bg-primary/5 text-xs font-bold gap-2"
                                                    onClick={() => openSubmissions(a)}
                                                >
                                                    <Eye size={14} /> View Submissions
                                                </Button>
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

                <Dialog open={!!viewingSubmissions} onOpenChange={(open) => !open && setViewingSubmissions(null)}>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto glass-panel border-border/50">
                        <DialogHeader>
                            <DialogTitle className="heading-3 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Submissions: {viewingSubmissions?.title}
                            </DialogTitle>
                            <DialogDescription>
                                Review work submitted by your students.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-4">
                            {submissionsLoading ? (
                                <div className="flex flex-col gap-4">
                                    {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                                </div>
                            ) : submissions.length > 0 ? (
                                <div className="grid gap-4">
                                    {submissions.map((sub) => (
                                        <Card key={sub.id} className="border-border/40 bg-muted/10">
                                            <CardHeader className="py-3 px-4 border-b border-border/20 flex flex-row items-center justify-between space-y-0">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{sub.student.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{sub.student.email}</span>
                                                </div>
                                                <Badge
                                                    className={cn(
                                                        "text-[10px] uppercase font-black",
                                                        sub.status === "LATE" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                                                    )}
                                                >
                                                    {sub.status}
                                                </Badge>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-4">
                                                <div className="text-sm bg-background/50 p-3 rounded-lg border border-border/10 whitespace-pre-wrap leading-relaxed">
                                                    {sub.content}
                                                </div>
                                                {sub.imageUrl && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                                            <ImageIcon size={12} /> Attachment
                                                        </div>
                                                        <a
                                                            href={sub.imageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block relative rounded-lg overflow-hidden border border-border/20 aspect-video group"
                                                        >
                                                            <img
                                                                src={sub.imageUrl}
                                                                alt="Student attachment"
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <ExternalLink className="text-white h-6 w-6" />
                                                            </div>
                                                        </a>
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter className="py-2 px-4 bg-muted/5 border-t border-border/10 flex justify-between items-center text-[10px]">
                                                <span className="text-muted-foreground italic">
                                                    Submitted: {new Date(sub.submittedAt).toLocaleString()}
                                                </span>
                                                {sub.grade ? (
                                                    <span className="font-bold text-primary">Graded: {sub.grade.marks}</span>
                                                ) : (
                                                    <span className="text-amber-600 font-bold uppercase tracking-wider">Pending Grade</span>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p>No submissions found yet for this assignment.</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
