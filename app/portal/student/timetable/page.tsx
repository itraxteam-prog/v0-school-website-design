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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Period times
const periods = [
  { id: 1, time: "08:00 - 08:45" },
  { id: 2, time: "08:45 - 09:30" },
  { id: 3, time: "09:30 - 10:15" },
  { id: 4, time: "10:30 - 11:15" }, // After break
  { id: 5, time: "11:15 - 12:00" },
  { id: 6, time: "12:00 - 12:45" },
  { id: 7, time: "13:30 - 14:15" }, // After lunch
  { id: 8, time: "14:15 - 15:00" },
]

// Subject color coding
const subjectColors: Record<string, string> = {
  Mathematics: "bg-primary/10 text-primary border-primary/20",
  Physics: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  English: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Chemistry: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  "Computer Science": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
  Urdu: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
  Islamiat: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Biology: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  Break: "bg-muted/50 text-muted-foreground border-border",
  Lunch: "bg-muted/50 text-muted-foreground border-border",
}

// Timetable data structure
interface ClassPeriod {
  subject: string
  teacher: string
  room: string
}

type WeekSchedule = {
  [day: string]: ClassPeriod[]
}

// Week 1 Schedule
const week1Schedule: WeekSchedule = {
  Monday: [
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
  ],
  Tuesday: [
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Islamiat", teacher: "Maulana Bilal", room: "Room 107" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
  ],
  Wednesday: [
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
  ],
  Thursday: [
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
    { subject: "Islamiat", teacher: "Maulana Bilal", room: "Room 107" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
  ],
  Friday: [
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Islamiat", teacher: "Maulana Bilal", room: "Room 107" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
  ],
  Saturday: [
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
  ],
}

// Week 2 Schedule (slightly different)
const week2Schedule: WeekSchedule = {
  Monday: [
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
  ],
  Tuesday: [
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Islamiat", teacher: "Maulana Bilal", room: "Room 107" },
  ],
  Wednesday: [
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
  ],
  Thursday: [
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Islamiat", teacher: "Maulana Bilal", room: "Room 107" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
  ],
  Friday: [
    { subject: "Islamiat", teacher: "Maulana Bilal", room: "Room 107" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "Urdu", teacher: "Ms. Ayesha Malik", room: "Room 103" },
  ],
  Saturday: [
    { subject: "Physics", teacher: "Dr. Sarah Khan", room: "Lab 201" },
    { subject: "Biology", teacher: "Dr. Zainab Tariq", room: "Lab 203" },
    { subject: "Computer Science", teacher: "Mr. Usman Shah", room: "Computer Lab" },
    { subject: "Break", teacher: "-", room: "-" },
    { subject: "Chemistry", teacher: "Dr. Hassan Raza", room: "Lab 202" },
    { subject: "Mathematics", teacher: "Mr. Ahmed Ali", room: "Room 101" },
    { subject: "Lunch", teacher: "-", room: "-" },
    { subject: "English", teacher: "Ms. Fatima Noor", room: "Room 105" },
  ],
}

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
  const { data: session } = useSession()

  useEffect(() => {
    // Set current day on client side to avoid hydration mismatch
    setCurrentDay(getCurrentDay())
  }, [])

  useEffect(() => {
    // Simulate data fetching
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [activeWeek])

  const currentSchedule = activeWeek === "week1" ? week1Schedule : week2Schedule

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

            {/* Week Toggle */}
            <ToggleGroup type="single" value={activeWeek} onValueChange={(value) => value && setActiveWeek(value)} className="justify-start md:justify-end">
              <ToggleGroupItem value="week1" aria-label="Week 1" className="px-6">
                Week 1
              </ToggleGroupItem>
              <ToggleGroupItem value="week2" aria-label="Week 2" className="px-6">
                Week 2
              </ToggleGroupItem>
            </ToggleGroup>
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
                {activeWeek === "week1" ? "Week 1" : "Week 2"} Schedule
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
                      Array.from({ length: 8 }).map((_, i) => (
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
                    ) : (
                      periods.map((period, periodIndex) => (
                        <TableRow key={period.id} className="border-border/50">
                          <TableCell className="font-medium text-muted-foreground">
                            <div className="text-xs">
                              <div className="font-semibold">Period {period.id}</div>
                              <div className="text-muted-foreground/70">{period.time}</div>
                            </div>
                          </TableCell>
                          {daysOfWeek.map((day) => {
                            const classInfo = currentSchedule[day]?.[periodIndex]
                            if (!classInfo) return <TableCell key={day}>-</TableCell>

                            const isBreakOrLunch = classInfo.subject === "Break" || classInfo.subject === "Lunch"
                            const isCurrentDay = day === currentDay

                            return (
                              <TableCell
                                key={day}
                                className={`p-2 ${isCurrentDay ? "bg-primary/5" : ""}`}
                              >
                                <div
                                  className={`group rounded-lg border p-3 transition-all hover:scale-[1.02] hover:shadow-md ${subjectColors[classInfo.subject] || "border-border bg-background"
                                    }`}
                                >
                                  <div className="text-sm font-semibold">
                                    {classInfo.subject}
                                  </div>
                                  {!isBreakOrLunch && (
                                    <>
                                      <div className="mt-1 text-xs opacity-80">
                                        {classInfo.teacher}
                                      </div>
                                      <div className="mt-0.5 text-xs opacity-60">
                                        {classInfo.room}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Legend */}
        <AnimatedWrapper delay={0.3}>
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Subject Legend:</span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(subjectColors)
                    .filter(([subject]) => subject !== "Break" && subject !== "Lunch")
                    .map(([subject, colorClass]) => (
                      <div key={subject} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-sm border ${colorClass}`}></div>
                        <span className="text-xs text-muted-foreground">{subject}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>

      </div>
    </AppLayout>
  )
}
