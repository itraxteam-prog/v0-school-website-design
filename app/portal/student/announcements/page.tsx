"use client"

import { useEffect, useState, useCallback } from "react"
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Clock,
  Megaphone,
  User,
  Calendar,
  ChevronRight,
  ChevronDown,
  Bell,
  Search,
  Trophy,
  Coffee,
  Info,
  MapPin,
  Clock3,
  AlertCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { MOCK_ANNOUNCEMENTS, MOCK_UPCOMING_EVENTS } from "@/utils/mocks"

import { sanitizeHtml } from "@/lib/xss"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  audience: string[];
}

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = MOCK_ANNOUNCEMENTS;

      // Filter for student-relevant announcements
      const studentData = data.filter((a: any) =>
        a.audience && (a.audience.includes("student") || a.audience.includes("all"))
      )
      setAnnouncements(studentData as Announcement[])
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: "Could not load announcements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAnnouncementDetails = (a: Announcement) => {
    const date = new Date(a.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    // Assign icons/colors based on title keyword or audience
    if (a.title.toLowerCase().includes("fair") || a.title.toLowerCase().includes("sport")) {
      return { icon: Trophy, color: "bg-amber-100 text-amber-700 border-amber-200", category: "Events", date }
    }
    if (a.title.toLowerCase().includes("exam") || a.title.toLowerCase().includes("notice")) {
      return { icon: Info, color: "bg-blue-100 text-blue-700 border-blue-200", category: "Academic", date }
    }
    return { icon: Megaphone, color: "bg-emerald-100 text-emerald-700 border-emerald-200", category: "General", date }
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="student">
      <div className="flex flex-col gap-8 pb-8">
        {/* Header */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="heading-2 text-burgundy-gradient">Announcements</h1>
              <p className="text-sm text-muted-foreground">Keep up with the latest school news and activities.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                className="h-10 pl-9 border-border bg-background/50 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </AnimatedWrapper>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main List Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="heading-3 text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Updates
            </h2>

            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="glass-panel border-border/50">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-12 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <div className="p-12 flex flex-col items-center justify-center text-center gap-4 glass-panel border-border/50">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Failed to load announcements</h3>
                    <p className="text-muted-foreground max-w-sm">{error}</p>
                  </div>
                  <Button onClick={fetchAnnouncements} variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              ) : filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((a, index) => {
                  const details = getAnnouncementDetails(a)
                  const Icon = details.icon

                  return (
                    <AnimatedWrapper key={a.id} delay={index * 0.1}>
                      <Card
                        className={cn(
                          "glass-panel border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/30",
                          expandedId === a.id && "ring-1 ring-primary/20 shadow-lg"
                        )}
                      >
                        <CardContent className="p-0">
                          <button
                            className="w-full p-5 text-left focus:outline-none flex flex-col gap-3"
                            onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-col gap-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-primary" />
                                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">{a.title}</h3>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {details.date}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold uppercase", details.color)}>
                                {details.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                              {sanitizeHtml(a.message)}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-semibold text-primary/80 flex items-center gap-1">
                                {expandedId === a.id ? "Show less" : "Read more"}
                                {expandedId === a.id ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                              </span>
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedId === a.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="px-5 pb-6 border-t border-border/30 pt-4 bg-muted/10">
                                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {sanitizeHtml(a.message)}
                                  </p>
                                  <Button size="sm" className="mt-4 bg-primary text-white hover:bg-primary/90 text-[11px] h-8">
                                    Add to My Calendar
                                  </Button>
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
                <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No announcements found matching your search.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Column - Upcoming Events */}
          <div className="flex flex-col gap-4">
            <h2 className="heading-3 text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </h2>

            <Card className="glass-panel border-border/50 overflow-hidden sticky top-6">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  This Month
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase">{`${MOCK_UPCOMING_EVENTS.length} Events`}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 border-b border-border last:border-0">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    ))
                  ) : (
                    MOCK_UPCOMING_EVENTS.map((event, i) => (
                      <div key={i} className="group p-4 border-b border-border/50 last:border-0 hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded leading-none">{event.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock3 className="h-3 w-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-primary/5">
                  <Button variant="ghost" className="w-full text-xs text-primary hover:bg-primary/10 hover:text-primary font-bold">
                    View All Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
