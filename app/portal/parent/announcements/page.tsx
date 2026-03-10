"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Clock,
    CalendarCheck,
    GraduationCap,
    Megaphone,
    Calendar,
    ChevronRight,
    ChevronDown,
    Trophy,
    Info,
    Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const PARENT_SIDEBAR = [
    { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/parent/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/parent/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/parent/grades", label: "Grades", icon: GraduationCap },
    { href: "/portal/parent/announcements", label: "Announcements", icon: Megaphone },
    { href: "/portal/parent/profile", label: "Profile", icon: Users },
]

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    targetRole: string;
    author: { name: string };
}

interface Child {
    id: string;
    name: string;
}

export default function ParentAnnouncementsPage() {
    const { data: session } = useSession()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChildId, setSelectedChildId] = useState<string>("")
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [announcementsLoading, setAnnouncementsLoading] = useState(false)

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await fetch("/api/parent/children")
                if (res.ok) {
                    const data = await res.json()
                    setChildren(data)
                    if (data.length > 0) {
                        setSelectedChildId(data[0].id)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch children:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchChildren()
    }, [])

    useEffect(() => {
        if (!selectedChildId) return

        const fetchAnnouncements = async () => {
            setAnnouncementsLoading(true)
            try {
                const res = await fetch(`/api/parent/child/${selectedChildId}/announcements`)
                if (res.ok) {
                    const data = await res.json()
                    setAnnouncements(data)
                }
            } catch (error) {
                console.error("Failed to fetch announcements:", error)
            } finally {
                setAnnouncementsLoading(false)
            }
        }
        fetchAnnouncements()
    }, [selectedChildId])

    if (loading) {
        return (
            <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName={session?.user?.name || "Parent"} userRole="Parent">
            <div className="flex flex-col gap-8 pb-8">
                {/* Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="heading-1 text-burgundy-gradient">Announcements</h1>
                            <p className="text-sm text-muted-foreground">
                                Stay informed with the latest school news and updates.
                            </p>
                        </div>
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <SelectValue placeholder="Select Child" />
                            </SelectTrigger>
                            <SelectContent>
                                {children.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AnimatedWrapper>

                {/* Announcements List */}
                <div className="flex flex-col gap-4">
                    {announcementsLoading ? (
                        [1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {announcements.length > 0 ? (
                                announcements.map((a, index) => {
                                    const isExpanded = expandedId === a.id
                                    const dateStr = new Date(a.createdAt).toLocaleDateString()

                                    // Categories based on targetRole or content keywords
                                    const category = a.targetRole === "PARENT" ? "Parent Only" : a.targetRole === "ALL" ? "General" : "Student Info"
                                    const color = a.targetRole === "PARENT" ? "bg-burgundy-50 text-burgundy-700 border-burgundy-100" : "bg-blue-50 text-blue-700 border-blue-100"
                                    const Icon = a.targetRole === "PARENT" ? Users : Megaphone

                                    return (
                                        <AnimatedWrapper key={a.id} delay={index * 0.1}>
                                            <Card
                                                className={cn(
                                                    "glass-panel border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/30",
                                                    isExpanded && "ring-1 ring-primary/20 shadow-lg"
                                                )}
                                            >
                                                <CardContent className="p-0">
                                                    <button
                                                        className="w-full p-5 text-left focus:outline-none flex flex-col gap-3"
                                                        onClick={() => setExpandedId(isExpanded ? null : a.id)}
                                                    >
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex flex-col gap-1.5 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Icon className="h-4 w-4 text-primary" />
                                                                    <h3 className="font-semibold text-foreground text-base">{a.title}</h3>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="h-3.5 w-3.5" /> {dateStr}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        By {a.author.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className={cn("px-2 py-0.5 text-[10px] font-bold uppercase", color)}
                                                            >
                                                                {category}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                                                            {a.content}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs font-semibold text-primary/80 flex items-center gap-1">
                                                                {isExpanded ? "Show less" : "Read more"}
                                                                {isExpanded ? (
                                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                                ) : (
                                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                                )}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            >
                                                                <div className="px-5 pb-6 border-t border-border/30 pt-4 bg-muted/10">
                                                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                                        {a.content}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </CardContent>
                                            </Card>
                                        </AnimatedWrapper>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No announcements found.
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
