"use client"

import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AttendanceChart, PerformanceChart } from "@/components/portal/dashboard-charts"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
]

const summaryCards = [
  { label: "Overall GPA", value: "3.75", sub: "out of 4.0", color: "text-burgundy-gradient" },
  { label: "Attendance", value: "94%", sub: "this semester", color: "text-burgundy-gradient" },
  { label: "Upcoming Assignments", value: "5", sub: "due this week", color: "text-foreground" },
  { label: "Pending Fees", value: "PKR 0", sub: "all cleared", color: "text-foreground" },
]

const grades = [
  { subject: "Mathematics", grade: "A", marks: "92/100" },
  { subject: "Physics", grade: "A-", marks: "87/100" },
  { subject: "English", grade: "A", marks: "90/100" },
  { subject: "Chemistry", grade: "B+", marks: "84/100" },
  { subject: "Computer Science", grade: "A+", marks: "96/100" },
]

const events = [
  { title: "Science Fair", date: "Feb 20, 2026", type: "Event" },
  { title: "Math Quiz - Chapter 5", date: "Feb 18, 2026", type: "Assessment" },
  { title: "Parent-Teacher Meeting", date: "Feb 25, 2026", type: "Meeting" },
  { title: "Sports Day", date: "Mar 5, 2026", type: "Event" },
]

export default function StudentDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-8">
        {/* Welcome */}
        <AnimatedWrapper direction="down">
          <div>
            <h1 className="heading-1 text-burgundy-gradient">Welcome back, Ahmed</h1>
            <p className="text-sm text-muted-foreground">Here is your academic overview for today.</p>
          </div>
        </AnimatedWrapper>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card, index) => (
            <AnimatedWrapper key={card.label} delay={index * 0.1}>
              <Card className="glass-card h-full">
                <CardContent className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{card.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
                </CardContent>
              </Card>
            </AnimatedWrapper>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatedWrapper delay={0.2}>
            <Card className="glass-panel">
              <CardContent className="p-6">
                <h3 className="heading-3 mb-6">Attendance Overview</h3>
                <AttendanceChart />
              </CardContent>
            </Card>
          </AnimatedWrapper>
          <AnimatedWrapper delay={0.3}>
            <Card className="glass-panel">
              <CardContent className="p-6">
                <h3 className="heading-3 mb-6">Academic Performance</h3>
                <PerformanceChart />
              </CardContent>
            </Card>
          </AnimatedWrapper>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Grade Overview */}
          <div className="lg:col-span-3">
            <AnimatedWrapper delay={0.4} className="h-full">
              <Card className="glass-panel h-full overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-b border-border/50 px-6 py-4 bg-muted/20">
                    <h2 className="heading-3">Recent Grades</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="px-6 py-3 font-bold uppercase tracking-wider text-xs text-muted-foreground">Subject</th>
                          <th className="px-6 py-3 font-bold uppercase tracking-wider text-xs text-muted-foreground">Grade</th>
                          <th className="px-6 py-3 font-bold uppercase tracking-wider text-xs text-muted-foreground">Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((g, i) => (
                          <tr key={g.subject} className={`border-b border-border/30 transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                            <td className="px-6 py-4 font-semibold text-foreground">{g.subject}</td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs">{g.grade}</span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-medium">{g.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <AnimatedWrapper delay={0.5} className="h-full">
              <Card className="glass-panel h-full">
                <CardContent className="p-0">
                  <div className="border-b border-border/50 px-6 py-4 bg-muted/20">
                    <h2 className="heading-3">Upcoming Events</h2>
                  </div>
                  <div className="flex flex-col">
                    {events.map((e, i) => (
                      <div key={e.title} className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/30 ${i < events.length - 1 ? "border-b border-border/30" : ""}`}>
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy-gradient text-white shadow-lg shadow-burgundy/20">
                          <CalendarCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{e.title}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">{e.date} &middot; {e.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
