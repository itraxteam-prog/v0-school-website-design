"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Clock,
  Megaphone,
  User,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  Hash,
  UserCircle,
  ShieldCheck,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { STUDENT_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

// Dummy student data
const studentData = {
  // Basic Info
  fullName: "Ahmed Khan",
  dateOfBirth: "March 15, 2010",
  gender: "Male",
  bloodGroup: "B+",
  nationality: "Pakistani",

  // Academic Info
  class: "Grade 10",
  section: "Section A",
  rollNumber: "2025-0142",
  admissionDate: "August 1, 2020",
  subjects: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
    "Computer Science",
    "Urdu",
    "Islamiat",
    "Biology"
  ],

  // Contact Info
  email: "ahmed.khan@pioneershigh.edu",
  phone: "+92 300 1234567",
  address: "45-B, Model Town, Lahore, Punjab",
  city: "Lahore",
  postalCode: "54000",

  // Guardian Info
  guardianName: "Mr. Imran Khan",
  guardianRelation: "Father",
  guardianPhone: "+92 321 9876543",
  guardianEmail: "imran.khan@email.com",
  guardianOccupation: "Business Owner",

  // Profile
  avatarUrl: "", // Empty for fallback
  initials: "AK",
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useSession()

  // Merge session user data with static profile data
  const displayData = {
    ...studentData,
    fullName: session?.user?.name || studentData.fullName,
    email: session?.user?.email || studentData.email,
  }

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AppLayout sidebarItems={sidebarItems} userName={session?.user?.name || studentData.fullName} userRole="student">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="heading-1 text-burgundy-gradient">My Profile</h1>
              <p className="text-sm text-muted-foreground">View and manage your personal information.</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
        </AnimatedWrapper>

        {/* Profile Layout */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Column - Profile Photo Card */}
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
                    <Skeleton className="h-10 w-full" />
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
                      <Badge variant="default" className="font-medium">
                        {displayData.class} - {displayData.section}
                      </Badge>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Hash className="h-3 w-3" />
                        Roll No: {displayData.rollNumber}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => alert("Photo upload will be available in the next release.")}
                    >
                      <UserCircle className="h-4 w-4" />
                      Change Photo
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </AnimatedWrapper>

          {/* Right Column - Information Cards */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Basic Information Card */}
            <AnimatedWrapper delay={0.2}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.fullName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.dateOfBirth}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.gender}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <span className="text-sm">{studentData.bloodGroup}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <span className="text-sm">{studentData.nationality}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Admission Date</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.admissionDate}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Academic Information Card */}
            <AnimatedWrapper delay={0.3}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </div>
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Class</label>
                          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{studentData.class}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Section</label>
                          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                            <span className="text-sm font-medium">{studentData.section}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{studentData.rollNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Enrolled Subjects</label>
                        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-muted/30 p-3">
                          {studentData.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="font-normal">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Contact Information Card */}
            <AnimatedWrapper delay={0.4}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.address}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <span className="text-sm">{studentData.city}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <span className="text-sm">{studentData.postalCode}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedWrapper>

            {/* Guardian Information Card */}
            <AnimatedWrapper delay={0.5}>
              <Card className="glass-panel overflow-hidden border-border/50">
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Guardian Name</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.guardianName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Relation</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <span className="text-sm">{studentData.guardianRelation}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Guardian Phone</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.guardianPhone}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Guardian Email</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{studentData.guardianEmail}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                          <span className="text-sm">{studentData.guardianOccupation}</span>
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
    </AppLayout>
  )
}
