"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Search, GraduationCap, Users, BarChart3, Settings, UserCheck, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

export function SearchManager() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams?.get("q") ?? ""

    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState(initialQuery)

    // No actual backend search needed for this navigational component
    useEffect(() => {
        setLoading(false)
    }, [query])


    const results = [
        { title: "Student Management", category: "Admin", description: "Add, edit or remove students from the system.", link: "/portal/admin/students", icon: GraduationCap },
        { title: "Teacher Directory", category: "Admin", description: "Manage teaching staff departments and assignments.", link: "/portal/admin/teachers", icon: Users },
        { title: "System Analytics", category: "Reports", description: "Overall institutional performance and enrollment data.", link: "/portal/admin/analytics", icon: BarChart3 },
        { title: "School Configuration", category: "Settings", description: "Update school names, logos, and general system settings.", link: "/portal/admin/school-settings", icon: Settings },
        { title: "Recent Enrollments", category: "Dashboard", description: "Review latest student registrations and status approvals.", link: "/portal/admin", icon: UserCheck },
    ].filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Super Admin" userRole="Admin">
            <div className="flex flex-col gap-8 pb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="heading-1 text-burgundy-gradient">Admin Search</h1>
                        <p className="text-sm text-muted-foreground">
                            {query ? `Showing results for "${query}"` : "Search across all admin modules"}
                        </p>
                    </div>
                    <div className="max-w-md relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search modules, users, settings..."
                            className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

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
                                <Link key={index} href={result.link} prefetch={true}>
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
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center gap-3">
                                <Search className="h-10 w-10 opacity-20" />
                                <p>No results found for &quot;{query}&quot;</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
