"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, LayoutDashboard, BookOpen, User, CalendarCheck, Clock, Megaphone, FileText, ChevronRight, ShieldCheck, Calendar, Loader2 } from "lucide-react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import { STUDENT_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

import { Suspense } from "react"

function StudentSearchContent() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams?.get("q") ?? ""
    const [query, setQuery] = useState(initialQuery)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate search logic
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [initialQuery])

    // Mock search results
    const results = [
        { title: "Mid-Term Results", category: "Grades", description: "Spring 2026 mid-term results are now available.", link: "/portal/student/grades", icon: FileText },
        { title: "Science Fair 2026", category: "Announcements", description: "Registration for the annual science fair is now open.", link: "/portal/student/announcements", icon: Megaphone },
        { title: "Ahmed Khan (Profile)", category: "Profile", description: "View your personal and academic profile information.", link: "/portal/student/profile", icon: User },
        { title: "Updated Timetable", category: "Academic", description: "Please check the new schedule for specialized elective courses.", link: "/portal/student/timetable", icon: Calendar },
    ].filter(r =>
        r.title.toLowerCase().includes(initialQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(initialQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(initialQuery.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2">
                        <h1 className="heading-1 text-burgundy-gradient">Search Results</h1>
                        <p className="text-sm text-muted-foreground"> Showing results for &quot;{initialQuery}&quot;</p>
                    </div>
                </AnimatedWrapper>

                <div className="max-w-2xl">
                    <div className="flex flex-col gap-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="glass-panel border-border/50">
                                    <CardContent className="p-4 flex gap-4">
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/4" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : results.length > 0 ? (
                            results.map((result, index) => (
                                <AnimatedWrapper key={index} delay={index * 0.1}>
                                    <Link href={result.link} prefetch={true}>
                                        <Card className="glass-panel border-border/50 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer group">
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <result.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{result.title}</h3>
                                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase">{result.category}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">{result.description}</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </AnimatedWrapper>
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center gap-3">
                                <Search className="h-10 w-10 opacity-20" />
                                <p>No results found for &quot;{initialQuery}&quot;</p>
                                <p className="text-xs">Try searching for &quot;Grades&quot;, &quot;Profile&quot;, or &quot;Science&quot;.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default function StudentSearchPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <StudentSearchContent />
        </Suspense>
    )
}
