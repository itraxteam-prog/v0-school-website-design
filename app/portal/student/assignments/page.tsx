"use client"

import { useEffect, useState, useCallback } from "react"
import {
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    Search,
    AlertCircle,
    RefreshCcw,
    FileText,
    CheckCircle2,
    Clock3,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { STUDENT_SIDEBAR as sidebarItems } from "@/lib/navigation-config"
import { useSession } from "next-auth/react"

interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number | null;
    classId: string;
    subject: string;
    class: { name: string };
    submissions: { id: string, status: string, submittedAt: string }[];
}

export default function StudentAssignmentsPage() {
    const [loading, setLoading] = useState(true)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter()

    const fetchAssignments = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/student/assignments")
            if (!res.ok) throw new Error("Failed to fetch assignments")
            const data = await res.json()
            setAssignments(data)
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
            toast({
                title: "Error",
                description: "Could not load assignments. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchAssignments()
    }, [fetchAssignments])

    const filteredAssignments = assignments.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.subject && a.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.class?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (a: Assignment) => {
        const submission = a.submissions[0]
        if (submission) {
            if (submission.status === "GRADED") return { label: "Graded", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
            return { label: "Submitted", color: "bg-blue-100 text-blue-700 border-blue-200" }
        }

        const dueDate = new Date(a.dueDate)
        if (dueDate < new Date()) {
            return { label: "Overdue", color: "bg-red-100 text-red-700 border-red-200" }
        }

        return { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200" }
    }

    return (
        <AppLayout
            sidebarItems={sidebarItems}
            userName={session?.user?.name || "Student"}
            userRole="student"
            userImage={session?.user?.image || undefined}
        >
            <div className="flex flex-col gap-8 pb-8">
                {/* Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="heading-2 text-burgundy-gradient">Assignments</h1>
                            <p className="text-sm text-muted-foreground">View and submit your classwork and homework.</p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search assignments..."
                                className="h-10 pl-9 border-border bg-background/50 focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </AnimatedWrapper>

                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-xl" />
                            ))
                        ) : error ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center gap-4 glass-panel border-border/50">
                                <AlertCircle className="h-12 w-12 text-destructive" />
                                <h3 className="font-semibold text-lg">Failed to load assignments</h3>
                                <Button onClick={fetchAssignments} variant="outline" className="gap-2">
                                    <RefreshCcw className="h-4 w-4" /> Try Again
                                </Button>
                            </div>
                        ) : filteredAssignments.length > 0 ? (
                            filteredAssignments.map((a, index) => {
                                const status = getStatusBadge(a)
                                return (
                                    <AnimatedWrapper key={a.id} delay={index * 0.05}>
                                        <Card
                                            className="glass-panel border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer"
                                            onClick={() => router.push(`/portal/student/assignments/${a.id}`)}
                                        >
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row">
                                                    <div className="p-6 flex-1">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase">
                                                                        {a.class?.name}
                                                                    </Badge>
                                                                    {a.subject && (
                                                                        <Badge variant="outline" className="text-[10px] font-bold uppercase">
                                                                            {a.subject}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <h3 className="heading-3 text-lg group-hover:text-primary transition-colors">{a.title}</h3>
                                                            </div>
                                                            <Badge className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase", status.color)}>
                                                                {status.label}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                <span>Due: {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                <span>{a.maxMarks ? `${a.maxMarks} Points` : 'Ungraded'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:flex items-center justify-center p-6 border-l border-border/30 bg-muted/5 group-hover:bg-primary/5 transition-colors">
                                                        <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </AnimatedWrapper>
                                )
                            })
                        ) : (
                            <div className="py-20 text-center glass-panel border-border/50">
                                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No assignments found</h3>
                                <p className="text-muted-foreground text-sm">You're all caught up! Check back later for new tasks.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    )
}
