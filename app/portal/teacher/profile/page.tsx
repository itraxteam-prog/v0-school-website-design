"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookMarked,
  FileBarChart,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Edit,
  Camera,
  BadgeCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/portal/teacher/gradebook", label: "Gradebook", icon: BookMarked },
  { href: "/portal/teacher/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/teacher/profile", label: "Profile", icon: User },
]

export default function TeacherProfilePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Mr. Usman Sheikh" userRole="teacher">
      <div className="flex flex-col gap-8 pb-8">
        {/* Header */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-1">
              <h1 className="heading-2 text-burgundy-gradient">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your personal and professional information.</p>
            </div>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </AnimatedWrapper>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Left Column - Photo Card */}
          <div className="lg:col-span-4 xl:col-span-3">
            <AnimatedWrapper delay={0.1}>
              <Card className="glass-panel border-border/50 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center gap-6">
                  {loading ? (
                    <Skeleton className="h-40 w-40 rounded-full" />
                  ) : (
                    <div className="relative group">
                      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-burgundy-gradient shadow-2xl overflow-hidden ring-4 ring-white/20">
                        <span className="text-5xl font-bold text-white">US</span>
                      </div>
                      <button className="absolute bottom-2 right-2 bg-primary text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  <div className="text-center space-y-1">
                    {loading ? (
                      <>
                        <Skeleton className="h-6 w-40 mx-auto" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </>
                    ) : (
                      <>
                        <h2 className="heading-3 text-xl">Mr. Usman Sheikh</h2>
                        <div className="flex items-center justify-center gap-1.5 text-primary font-medium text-sm">
                          <BadgeCheck className="h-4 w-4" />
                          Senior Mathematics Teacher
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-full pt-4 border-t border-border/50">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Employee ID</span>
                        <span className="font-semibold">{loading ? <Skeleton className="h-4 w-16" /> : "TCH-0042"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>
          </div>

          {/* Right Column - Info Cards */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* Basic Info */}
            <AnimatedWrapper delay={0.2}>
              <Card className="glass-panel border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-border/50">
                  <CardTitle className="heading-3 text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InfoItem label="Full Name" value="Usman Sheikh" loading={loading} />
                    <InfoItem label="Date of Birth" value="12th October 1985" loading={loading} />
                    <InfoItem label="Gender" value="Male" loading={loading} />
                    <InfoItem label="Employee ID" value="TCH-0042" loading={loading} />
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Academic Info */}
            <AnimatedWrapper delay={0.3}>
              <Card className="glass-panel border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-border/50">
                  <CardTitle className="heading-3 text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Academic & Professional Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InfoItem label="Qualifications" value="M.Sc. Mathematics, B.Ed" loading={loading} icon={GraduationCap} />
                    <InfoItem label="Subjects Taught" value="Mathematics, Physics" loading={loading} />
                    <InfoItem label="Classes Managed" value="Grade 10-A, Grade 9-A" loading={loading} icon={Users} />
                    <InfoItem label="Joining Date" value="15th August 2018" loading={loading} icon={Calendar} />
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Contact Info */}
            <AnimatedWrapper delay={0.4}>
              <Card className="glass-panel border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-border/50">
                  <CardTitle className="heading-3 text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InfoItem label="Email Address" value="usman.sheikh@pioneershigh.edu" loading={loading} icon={Mail} />
                    <InfoItem label="Phone Number" value="+92 300 9876543" loading={loading} icon={Phone} />
                    <InfoItem
                      label="Residential Address"
                      value="House #123, Block-A, Gulberg III, Lahore"
                      loading={loading}
                      icon={MapPin}
                      fullWidth
                    />
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>

          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function InfoItem({ label, value, loading, icon: Icon, fullWidth = false }: any) {
  return (
    <div className={cn("flex flex-col gap-2", fullWidth && "sm:col-span-2")}>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      {loading ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/40 p-3.5 transition-colors hover:bg-muted/60">
          {Icon && <Icon className="h-4 w-4 text-primary shrink-0" />}
          <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
      )}
    </div>
  )
}
