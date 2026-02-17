"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookMarked,
  FileBarChart,
  User,
  MoreVertical,
  GraduationCap,
  MapPin,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
  { href: "/portal/security", label: "Security", icon: ShieldCheck },
]



export default function TeacherClassesPage() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_URL}/teacher/classes`);
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (error) {
        console.error("Failed to fetch classes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [])

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="teacher">
      <div className="flex flex-col gap-8 pb-8">
        {/* Header */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-1">
            <h1 className="heading-2 text-burgundy-gradient">My Classes</h1>
            <p className="text-sm text-muted-foreground">Manage your assigned classes and monitor student progress.</p>
          </div>
        </AnimatedWrapper>

        {/* Classes Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass-panel border-border/50 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardFooter>
              </Card>
            ))
          ) : (
            classes.length === 0 ? (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No classes assigned.
              </div>
            ) : (
              classes.map((cls, index) => (
                <AnimatedWrapper key={cls.id} delay={index * 0.1}>
                  <Card className={cn(
                    "glass-card group overflow-hidden border-border/50 hover:border-primary/30",
                    "bg-gradient-to-br", cls.color
                  )}>
                    <CardHeader className="pb-4 relative">
                      <div className="flex justify-between items-start">
                        <CardTitle className="heading-3 text-lg">{cls.name}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-primary">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-primary mt-0.5">{cls.subject}</p>
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <GraduationCap className="h-16 w-16" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{cls.studentCount} Students Enrolled</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{cls.room}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            Average Performance
                          </div>
                          <span className="text-sm font-bold text-foreground">{cls.performance}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${cls.performance}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 border-t border-border/30 bg-muted/10">
                      <Button
                        variant="ghost"
                        className="w-full justify-between items-center group-hover:bg-primary group-hover:text-white transition-all text-sm font-semibold"
                        onClick={() => window.location.href = '/portal/teacher/attendance'}
                      >
                        <span>Manage Attendance</span>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimatedWrapper>
              ))
            ))}
        </div>

        {/* Info Box */}
        {!loading && (
          <AnimatedWrapper delay={0.5}>
            <div className="mt-4 rounded-xl border border-primary/10 bg-primary/5 p-4 md:p-6 lg:flex lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Weekly Overview</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">You have {classes.length} active classes assigned.</p>
                </div>
              </div>
              <Button
                className="mt-4 lg:mt-0 w-full lg:w-auto bg-primary text-white hover:bg-primary/90"
                onClick={() => window.location.href = '/portal/teacher'}
              >
                View Full Timetable
              </Button>
            </div>
          </AnimatedWrapper>
        )}
      </div>
    </AppLayout>
  )
}
