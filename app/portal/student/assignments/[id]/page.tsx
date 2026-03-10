"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    Send,
    AlertCircle,
    Info,
    Image as ImageIcon,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { STUDENT_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number | null;
    subject: string;
    class: { name: string };
    submissions: any[];
}

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [submissionContent, setSubmissionContent] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`/api/student/assignments/${params.id}`)
                if (!res.ok) throw new Error("Assignment not found")
                const data = await res.json()
                setAssignment(data)

                if (data.submissions?.[0]) {
                    setSubmissionContent(data.submissions[0].content)
                    setImageUrl(data.submissions[0].imageUrl || "")
                }
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Could not load assignment details.",
                    variant: "destructive",
                })
                router.push("/portal/student/assignments")
            } finally {
                setLoading(false)
            }
        }

        fetchAssignment()
    }, [params.id, router, toast])

    const handleSubmit = async () => {
        if (!submissionContent.trim()) {
            toast({
                title: "Empty content",
                description: "Please enter your submission content.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/student/assignments/${params.id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: submissionContent,
                    imageUrl: imageUrl
                }),
            })

            if (!res.ok) throw new Error("Failed to submit")

            toast({
                title: "Success!",
                description: "Your assignment has been submitted.",
            })

            // Refresh data
            const updatedRes = await fetch(`/api/student/assignments/${params.id}`)
            const updatedData = await updatedRes.json()
            setAssignment(updatedData)
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to submit assignment. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <AppLayout
                sidebarItems={sidebarItems}
                userName={session?.user?.name || "Student"}
                userRole="student"
            >
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        )
    }

    if (!assignment) return null

    const submission = assignment.submissions?.[0]
    const isGraded = submission?.status === "GRADED"
    const isLate = new Date() > new Date(assignment.dueDate) && !submission

    return (
        <AppLayout
            sidebarItems={sidebarItems}
            userName={session?.user?.name || "Student"}
            userRole="student"
            userImage={session?.user?.image || undefined}
        >
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <AnimatedWrapper direction="left">
                    <Button
                        variant="ghost"
                        className="group mb-4 gap-2 hover:bg-primary/5 hover:text-primary transition-all"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Assignments
                    </Button>
                </AnimatedWrapper>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatedWrapper direction="down">
                            <Card className="glass-panel border-border/50 overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase">
                                            {assignment.class?.name}
                                        </Badge>
                                        {assignment.subject && (
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase">
                                                {assignment.subject}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="heading-3 text-2xl">{assignment.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                            {assignment.description || "No specific instructions provided."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedWrapper>

                        <AnimatedWrapper delay={0.1}>
                            <Card className="glass-panel border-border/50">
                                <CardHeader>
                                    <CardTitle className="heading-3 text-lg flex items-center gap-2">
                                        <Send className="h-5 w-5 text-primary" />
                                        Your Submission
                                    </CardTitle>
                                    <CardDescription>
                                        {isGraded ? "This assignment has been graded and cannot be modified." : "Type your answer or paste the link to your work below."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder="Enter your response here..."
                                        className="min-h-[200px] glass-card focus:ring-primary/20 leading-relaxed resize-none mb-6"
                                        value={submissionContent}
                                        onChange={(e) => setSubmissionContent(e.target.value)}
                                        disabled={isGraded || isSubmitting}
                                    />

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-semibold">Image Attachment (Optional)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Paste image URL here..."
                                                className="glass-card"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                disabled={isGraded || isSubmitting}
                                            />
                                        </div>
                                        {imageUrl && (
                                            <div className="relative mt-4 rounded-xl overflow-hidden border border-border/50 aspect-video bg-muted/20">
                                                <img
                                                    src={imageUrl}
                                                    alt="Submission preview"
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t border-border/50 bg-muted/20 pt-6">
                                    <div className="text-xs text-muted-foreground italic flex items-center gap-2">
                                        {submission && (
                                            <>
                                                <Clock className="h-3 w-3" />
                                                Last submitted: {new Date(submission.submittedAt).toLocaleString()}
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || isGraded}
                                        className="bg-primary hover:bg-primary/90 text-white shadow-burgundy-glow min-w-[140px]"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                                        ) : submission ? (
                                            "Update Submission"
                                        ) : (
                                            "Submit Assignment"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </AnimatedWrapper>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <AnimatedWrapper direction="right">
                            <Card className="glass-panel border-border/50 overflow-hidden sticky top-8">
                                <CardHeader className="bg-muted/30 border-b border-border/50">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider">Information</CardTitle>
                                </CardHeader>
                                <CardContent className="divide-y divide-border/30 p-0">
                                    <div className="p-4 space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Max Points</span>
                                        <div className="flex items-center gap-2 font-bold text-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            {assignment.maxMarks ? `${assignment.maxMarks} Points` : 'Non-graded / Homework'}
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Due Date</span>
                                        <div className={cn(
                                            "flex items-center gap-2 font-bold",
                                            isLate ? "text-destructive" : "text-foreground"
                                        )}>
                                            <Calendar className="h-4 w-4" />
                                            {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                                        <div className="mt-1">
                                            {submission ? (
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cn(
                                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                        submission.status === "GRADED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-blue-100 text-blue-700 border-blue-200"
                                                    )}>
                                                        {submission.status.toLowerCase()}
                                                    </Badge>
                                                    {submission.status === "LATE" && (
                                                        <Badge variant="destructive" className="text-[10px] font-bold uppercase">Late</Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                    isLate ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"
                                                )}>
                                                    {isLate ? "Overdue" : "Pending"}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {submission?.grade && (
                                        <div className="p-6 bg-primary/5 space-y-2">
                                            <span className="text-[10px] font-bold text-primary uppercase">Your Result</span>
                                            <div className="flex items-end justify-between">
                                                <div className="text-3xl font-black text-primary">
                                                    {submission.grade.marks}
                                                </div>
                                                <div className="text-muted-foreground text-xs pb-1">
                                                    / {assignment.maxMarks}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </AnimatedWrapper>

                        {isLate && !submission && (
                            <AnimatedWrapper delay={0.2} direction="right">
                                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3 shadow-sm">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-wider">Late Submission</p>
                                        <p className="text-[10px] opacity-80 leading-relaxed">
                                            This assignment is past its due date. Submitting now will mark your work as late.
                                        </p>
                                    </div>
                                </div>
                            </AnimatedWrapper>
                        )}

                        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 flex items-start gap-3">
                            <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 opacity-50" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-900/50">Need Help?</p>
                                <p className="text-[10px] opacity-80 leading-relaxed">
                                    If you're having trouble with this assignment, please message your teacher through the portal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
