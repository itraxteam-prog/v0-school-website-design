"use client"

import { useEffect, useState } from "react"
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

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
]

const dummyAnnouncements = [
  {
    id: 1,
    title: "Annual Science Fair 2026",
    date: "Feb 14, 2026",
    category: "Events",
    summary: "Registration is now open for the Annual Science Fair. Showcase your innovation and win prizes!",
    content: "All students from Grade 6 to 12 are invited to participate. This year's theme is 'Sustainable Solutions for a Greener Planet'. Projects must be submitted by February 18th in the main lab. Final judging will take place on February 20th in the auditorium. Grand prize includes a fully funded trip to the National Science Museum.",
    icon: Trophy,
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: 2,
    title: "Mid-Term Examination Schedule",
    date: "Feb 12, 2026",
    category: "Academic",
    summary: "The official schedule for Spring Mid-Terms is now available. Please check your specific grade dates.",
    content: "Examinations will begin from March 10th and continue until March 22nd. Please ensure you have cleared all your library dues before the exams start. Admit cards will be distributed in the second week of March. Study halls will be open until 8 PM during the exam period.",
    icon: Info,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: 3,
    title: "School Library Renovation",
    date: "Feb 10, 2026",
    category: "General",
    summary: "The main library will be closed for a week starting next Monday for floor maintenance and new shelf installations.",
    content: "We are expanding our digital archives and adding 500 new titles. During the closure, books can still be returned at the main reception. The 'e-library' portal will remain fully functional for your research needs. We apologize for the temporary inconvenience.",
    icon: Coffee,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
]

const upcomingEvents = [
  { title: "Basketball Finals", date: "Feb 18", time: "02:00 PM", location: "Gym A" },
  { title: "Drama Club Play", date: "Feb 22", time: "05:30 PM", location: "Auditorium" },
  { title: "Career Fair", date: "Feb 25", time: "09:00 AM", location: "Main Hall" },
]

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const filteredAnnouncements = dummyAnnouncements.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              ) : filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((a, index) => (
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
                                <a.icon className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">{a.title}</h3>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {a.date}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold uppercase", a.color)}>
                              {a.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                            {a.summary}
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
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {a.content}
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
                ))
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
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase">{upcomingEvents.length} Events</Badge>
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
                    upcomingEvents.map((event, i) => (
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
