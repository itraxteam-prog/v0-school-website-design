"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, CalendarCheck, BookMarked, FileBarChart, User } from "lucide-react"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

export default function TeacherProfilePage() {
  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="Teacher">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground md:text-2xl">Profile</h1>
          <p className="text-sm text-muted-foreground">Your personal and professional information.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                US
              </div>
              <div className="text-center">
                <p className="font-serif text-lg font-semibold text-foreground">Mr. Usman Sheikh</p>
                <p className="text-sm text-primary">Mathematics</p>
                <p className="text-xs text-muted-foreground">Employee ID: TCH-0042</p>
              </div>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" disabled>
                Change Photo
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border lg:col-span-2">
            <CardContent className="flex flex-col gap-5 p-6">
              <h2 className="font-serif text-base font-semibold text-foreground">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Full Name</Label>
                  <Input value="Usman Sheikh" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Qualification</Label>
                  <Input value="M.Sc. Mathematics" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input value="usman.sheikh@pioneershigh.edu" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input value="+92 300 9876543" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Department</Label>
                  <Input value="Mathematics" className="h-11" readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Joining Date</Label>
                  <Input value="August 15, 2018" className="h-11" readOnly />
                </div>
              </div>
              <Button className="mt-2 h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto" disabled>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
