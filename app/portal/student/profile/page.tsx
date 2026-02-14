"use client"

import { DashboardLayout } from "@/components/portal/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, BookOpen, CalendarCheck, Clock, Megaphone, User } from "lucide-react"

const sidebarItems = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/grades", label: "My Grades", icon: BookOpen },
  { href: "/portal/student/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/student/timetable", label: "Timetable", icon: Clock },
  { href: "/portal/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/portal/student/profile", label: "Profile", icon: User },
]

export default function ProfilePage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Ahmed Khan" userRole="Student">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Profile</h1>
          <p className="text-sm text-muted-foreground">Your personal information and account settings.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Avatar Card */}
          <Card className="border-border lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                AK
              </div>
              <div className="text-center">
                <p className="font-serif text-lg font-semibold text-foreground">Ahmed Khan</p>
                <p className="text-sm text-primary">Grade 10 - Section A</p>
                <p className="text-xs text-muted-foreground">Roll No: 2025-0142</p>
              </div>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" disabled>
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="border-border lg:col-span-2">
            <CardContent className="flex flex-col gap-5 p-6">
              <h2 className="font-serif text-base font-semibold text-foreground">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Full Name</Label>
                  <Input value="Ahmed Khan" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Date of Birth</Label>
                  <Input value="March 15, 2010" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input value="ahmed.khan@pioneershigh.edu" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input value="+92 300 1234567" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Guardian Name</Label>
                  <Input value="Mr. Imran Khan" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Address</Label>
                  <Input value="45-B, Model Town, Lahore" className="h-11" readOnly />
                </div>
              </div>
              <Button className="mt-2 h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto" disabled>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
