"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const PARENT_SIDEBAR = [
    { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/parent/timetable", label: "Timetable", icon: Clock },
    { href: "/portal/parent/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/portal/parent/grades", label: "Grades", icon: GraduationCap },
    { href: "/portal/parent/announcements", label: "Announcements", icon: Megaphone },
]

const MOCK_ANNOUNCEMENTS = [
    {
        id: "1",
        title: "Mid-Term Examination Schedule Released",
        message:
            "The mid-term examination schedule for Spring 2026 has been finalized. Exams will be held from March 20 – March 28, 2026. Parents are requested to ensure their children are prepared and arrive on time. Detailed subject-wise timetables are available at the school reception.",
        date: "Mar 01, 2026",
        category: "Academic",
        icon: Info,
        color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
        id: "2",
        title: "Annual Sports Day – March 15, 2026",
        message:
            "We are excited to announce our Annual Sports Day on March 15, 2026. All students are encouraged to participate in various athletic events. Parents are warmly invited to attend and cheer for their children. The event will run from 9:00 AM to 3:00 PM on the main sports grounds.",
        date: "Feb 25, 2026",
        category: "Events",
        icon: Trophy,
        color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
        id: "3",
        title: "Parent-Teacher Meeting – March 10",
        message:
            "A Parent-Teacher Meeting (PTM) is scheduled for March 10, 2026 from 10:00 AM to 1:00 PM. This is an opportunity for parents to discuss their child's academic progress, attendance, and overall well-being. Please confirm your attendance by contacting the school office by March 7.",
        date: "Feb 20, 2026",
        category: "General",
        icon: Megaphone,
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
]

export default function ParentAnnouncementsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <AppLayout sidebarItems={PARENT_SIDEBAR} userName="Parent User" userRole="Parent">
            <div className="flex flex-col gap-8 pb-8">
                {/* Header */}
                <AnimatedWrapper direction="down">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Announcements</h1>
                        <p className="text-sm text-muted-foreground">
                            Stay informed with the latest school news and updates.
                        </p>
                    </div>
                </AnimatedWrapper>

                {/* Announcements List */}
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {MOCK_ANNOUNCEMENTS.map((a, index) => {
                            const Icon = a.icon
                            const isExpanded = expandedId === a.id
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
                                                                <Calendar className="h-3.5 w-3.5" /> {a.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("px-2 py-0.5 text-[10px] font-bold uppercase", a.color)}
                                                    >
                                                        {a.category}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                                                    {a.message}
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
                                                                {a.message}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </AnimatedWrapper>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    )
}
