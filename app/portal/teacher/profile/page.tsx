"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Hash,
  BadgeCheck,
} from "lucide-react"
import { useSession } from "next-auth/react"

export default function TeacherProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/teacher/profile")
        if (!res.ok) throw new Error("Failed to load profile")
        const data = await res.json()
        setProfileData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const displayData = profileData || {
    fullName: session?.user?.name || "Loading...",
    email: session?.user?.email || "Loading...",
    initials: session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "T",
    employeeId: "...",
    status: "...",
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <AnimatedWrapper direction="down">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading-1 text-burgundy-gradient">My Profile</h1>
            <p className="text-sm text-muted-foreground">View your personal and professional information.</p>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Profile Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Card */}
        <AnimatedWrapper delay={0.1} className="lg:col-span-1">
          <Card className="glass-panel overflow-hidden border-border/50">
            <CardContent className="flex flex-col items-center gap-6 p-6">
              {loading ? (
                <>
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage src={displayData.avatarUrl} alt={displayData.fullName} />
                    <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                      {displayData.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-2">
                    <h2 className="heading-3">{displayData.fullName}</h2>
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                        <BadgeCheck size={14} className="mr-1" /> Senior Faculty
                      </Badge>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Hash className="h-3 w-3" />
                        Employee ID: {displayData.employeeId}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </AnimatedWrapper>

        {/* Right Column - Information Cards */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Basic Information Card */}
          <AnimatedWrapper delay={0.2}>
            <Card className="glass-panel overflow-hidden border-border/50 shadow-md transition-shadow hover:shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle className="heading-3 flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <User className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.fullName}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date of Birth</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <Calendar className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.dateOfBirth ? new Date(displayData.dateOfBirth).toLocaleDateString() : "Not Specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <BadgeCheck className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.gender || "Not Specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-end">
                      {/* Empty spacing if needed or other data */}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>

          {/* Professional Information Card */}
          <AnimatedWrapper delay={0.3}>
            <Card className="glass-panel overflow-hidden border-border/50 shadow-md transition-shadow hover:shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle className="heading-3 flex items-center gap-2 text-primary">
                  <Briefcase className="h-5 w-5" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Qualifications</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <GraduationCap className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.qualification}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject(s)</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <Briefcase className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.subjects}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Classes</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <BadgeCheck className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.classes}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Joining Date</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <Calendar className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.joiningDate ? new Date(displayData.joiningDate).toLocaleDateString() : "Not Specified"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>

          {/* Contact Details Card */}
          <AnimatedWrapper delay={0.4}>
            <Card className="glass-panel overflow-hidden border-border/50 shadow-md transition-shadow hover:shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle className="heading-3 flex items-center gap-2 text-primary">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <Mail className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <Phone className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Address</span>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 shadow-sm">
                        <MapPin className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{displayData.address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  )
}
