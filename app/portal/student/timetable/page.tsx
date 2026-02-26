"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User, ShieldCheck } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { useSession } from "next-auth/react"
import { STUDENT_SIDEBAR as sidebarItems } from "@/lib/navigation-config"


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Timetable data structure
interface ClassPeriod {
  subject: string
  teacher: string
  room: string
  startTime: string
  endTime: string
}

type WeekSchedule = {
  [day: string]: ClassPeriod[]
}

// No static data needed anymore. Loading from API.

// Get current day (0 = Sunday, 1 = Monday, etc.)
function getCurrentDay(): string {
  const today = new Date()
  const dayIndex = today.getDay()
  // Map Sunday (0) to Saturday, Monday (1) to Monday, etc.
  const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return dayMap[dayIndex]
}

export default function TimetablePage() {
  const [activeWeek, setActiveWeek] = useState("week1")
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState<string>("")
  const [schedule, setSchedule] = useState<WeekSchedule>({})
  const { data: session } = useSession()

  useEffect(() => {
    // Set current day on client side to avoid hydration mismatch
    setCurrentDay(getCurrentDay())
  }, [])

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/student/timetable")
        if (!response.ok) throw new Error("Failed to fetch timetable")
        const data = await response.json()

        // Transform flat DB entries into WeekSchedule format
        const transformed: WeekSchedule = {
          Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
        }

        // Map DayOfWeek enum to UI strings
        const dayMap: Record<string, string> = {
          MONDAY: "Monday",
          TUESDAY: "Tuesday",
          WEDNESDAY: "Wednesday",
          THURSDAY: "Thursday",
          FRIDAY: "Friday",
          SATURDAY: "Saturday",
          SUNDAY: "Sunday"
        }

        data.forEach((entry: any) => {
          const dayName = dayMap[entry.dayOfWeek]
          if (dayName) {
            transformed[dayName].push({
              subject: entry.subjectName,
              teacher: entry.teacher?.name || "N/A",
              room: entry.room || "N/A",
              startTime: entry.startTime,
              endTime: entry.endTime,
            })
          }
        })

        // Sort each day's periods by startTime
        Object.keys(transformed).forEach(day => {
          transformed[day].sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
        })

        setSchedule(transformed)
      } catch (error) {
        console.error("Error fetching timetable:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimetable()
  }, [])

  // Calculate unique time slots from the schedule
  const timeSlots = Array.from(new Set(
    Object.values(schedule).flat().map(s => `${s.startTime} - ${s.endTime}`)
  )).sort().map((slot, index) => ({
    id: index + 1,
    time: slot
  }))

  return (
    <AppLayout sidebarItems={sidebarItems} userName={session?.user?.name || "Student"} userRole="student">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="heading-1 text-burgundy-gradient">Timetable</h1>
              <p className="text-sm text-muted-foreground">Your weekly class schedule and periods.</p>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Current Day Badge */}
        {currentDay && daysOfWeek.includes(currentDay) && (
          <AnimatedWrapper delay={0.1}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                <Clock className="h-3 w-3" />
                Today is {currentDay}
              </Badge>
            </div>
          </AnimatedWrapper>
        )}

        {/* Timetable Card */}
        <AnimatedWrapper delay={0.2}>
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardHeader>
              <CardTitle className="heading-3">
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="w-[120px] font-semibold">Time</TableHead>
                      {daysOfWeek.map((day) => (
                        <TableHead
                          key={day}
                          className={`min-w-[200px] text-center font-semibold ${day === currentDay ? "bg-primary/10 text-primary" : ""
                            }`}
                        >
                          {day}
                          {day === currentDay && (
                            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Skeleton Loader
                      Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i} className="border-border/50">
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          {daysOfWeek.map((day) => (
                            <TableCell key={day}>
                              <Skeleton className="h-20 w-full rounded-lg" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : timeSlots.length > 0 ? (
                      timeSlots.map((slot) => (
                        <TableRow key={slot.id} className="border-border/50">
                          <TableCell className="font-medium text-muted-foreground">
                            <div className="text-xs">
                              <div className="font-semibold text-primary">Period {slot.id}</div>
                              <div className="text-muted-foreground/70">{slot.time}</div>
                            </div>
                          </TableCell>
                          {daysOfWeek.map((day) => {
                            const classInfo = schedule[day]?.find(s => `${s.startTime} - ${s.endTime}` === slot.time)
                            if (!classInfo) return <TableCell key={day} className="text-center text-muted-foreground/30 font-mono text-xs">-</TableCell>

                            const isCurrentDay = day === currentDay

                            return (
                              <TableCell
                                key={day}
                                className={`p-2 ${isCurrentDay ? "bg-primary/5" : ""}`}
                              >
                                <div
                                  className={`group rounded-lg border p-3 border-border bg-background transition-all hover:scale-[1.02] hover:shadow-md h-full`}
                                >
                                  <div className="text-sm font-semibold text-primary">
                                    {classInfo.subject}
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground font-medium">
                                    {classInfo.teacher}
                                  </div>
                                  <div className="mt-0.5 text-xs text-muted-foreground/60">
                                    {classInfo.room}
                                  </div>
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={daysOfWeek.length + 1} className="h-32 text-center text-muted-foreground italic">
                          No schedule data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>



      </div>
    </AppLayout>
  )
}
