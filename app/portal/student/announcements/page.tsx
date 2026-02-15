"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User } from "lucide-react"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
]

const announcements = [
  { title: "Science Fair 2026", date: "Feb 14, 2026", category: "Event", content: "All students are invited to participate in the annual Science Fair. Projects must be submitted by February 18th. Judging will take place on February 20th in the school auditorium." },
  { title: "Mid-Term Exams Schedule Released", date: "Feb 12, 2026", category: "Academic", content: "The mid-term examination schedule for Spring 2026 has been finalized. Exams will commence from March 10th. Students are advised to begin preparation early." },
  { title: "Sports Day Registration", date: "Feb 10, 2026", category: "Sports", content: "Registration for the Annual Sports Day is now open. Students can register for up to 3 events. Last date for registration is February 25th." },
  { title: "Parent-Teacher Meeting", date: "Feb 8, 2026", category: "Meeting", content: "A parent-teacher meeting is scheduled for February 25th from 10:00 AM to 1:00 PM. All parents are requested to attend to discuss student progress." },
  { title: "Library Book Drive", date: "Feb 5, 2026", category: "General", content: "The school library is organizing a book drive. Students are encouraged to donate books they have already read. Collection boxes are placed in every classroom." },
]

const categoryColors: Record<string, string> = {
  Event: "bg-primary/10 text-primary",
  Academic: "bg-blue-50 text-blue-700",
  Sports: "bg-green-50 text-green-700",
  Meeting: "bg-amber-50 text-amber-700",
  General: "bg-muted text-muted-foreground",
}

export default function AnnouncementsPage() {
  return (
    <AppLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Announcements</h1>
          <p className="text-sm text-muted-foreground">Stay updated with school news and events.</p>
        </div>

        <div className="flex flex-col gap-4">
          {announcements.map((a) => (
            <Card key={a.title} className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-semibold text-foreground">{a.title}</h3>
                      <Badge className={`text-[10px] ${categoryColors[a.category]}`}>{a.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
