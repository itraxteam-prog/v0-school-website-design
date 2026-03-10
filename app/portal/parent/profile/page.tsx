"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Users,
    Briefcase,
    HeartPulse,
    Baby,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function ParentProfilePage() {
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState<any>(null)
    const [children, setChildren] = useState<any[]>([])
    const { data: session } = useSession()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [profileRes, childrenRes] = await Promise.all([
                    fetch("/api/user/profile"),
                    fetch("/api/parent/children")
                ])

                if (profileRes.ok) {
                    const data = await profileRes.json()
                    setProfileData(data)
                }

                if (childrenRes.ok) {
                    const data = await childrenRes.json()
                    setChildren(data)
                }
            } catch (err) {
                console.error("Failed to load parent data:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const displayUser = profileData || {
        name: session?.user?.name || "Parent User",
        email: session?.user?.email || "",
        profile: {}
    }

    const profile = displayUser.profile || {}
    const initials = displayUser.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || "P"

    return (
        <div className="flex flex-col gap-8 pb-8">
            {/* Header */}
            <AnimatedWrapper direction="down">
                <div className="flex flex-col gap-2">
                    <h1 className="heading-1 text-burgundy-gradient">Parent Profile</h1>
                    <p className="text-sm text-muted-foreground">Manage your information and view linked students.</p>
                </div>
            </AnimatedWrapper>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Card */}
                <AnimatedWrapper delay={0.1} className="lg:col-span-1">
                    <Card className="glass-panel overflow-hidden border-border/50">
                        <CardContent className="flex flex-col items-center gap-6 p-6">
                            {loading ? (
                                <Skeleton className="h-32 w-32 rounded-full" />
                            ) : (
                                <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
                                    <AvatarImage src={session?.user?.image || ""} alt={displayUser.name || "User"} />
                                    <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div className="text-center space-y-2">
                                {loading ? (
                                    <Skeleton className="h-6 w-32 mx-auto" />
                                ) : (
                                    <>
                                        <h2 className="heading-3">{displayUser.name}</h2>
                                        <Badge variant="secondary" className="font-semibold uppercase tracking-wider text-[10px]">
                                            Parent Account
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Linked Children Card */}
                    <Card className="glass-panel mt-6 border-border/50">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Baby className="h-4 w-4 text-primary" />
                                Linked Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ) : children.length > 0 ? (
                                <div className="divide-y divide-border/50">
                                    {children.map((child) => (
                                        <div key={child.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{child.name}</span>
                                                <span className="text-[10px] text-muted-foreground">Class: {child.class} — Roll: {child.rollNumber}</span>
                                            </div>
                                            <Users className="h-4 w-4 text-muted-foreground/30" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-xs text-muted-foreground italic">
                                    No students linked to this account.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </AnimatedWrapper>

                {/* Right Column - Details */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <AnimatedWrapper delay={0.2}>
                        <Card className="glass-panel border-border/50">
                            <CardHeader>
                                <CardTitle className="heading-3 flex items-center gap-2 text-primary">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-2">
                                <ProfileItem icon={Mail} label="Email Address" value={displayUser.email} />
                                <ProfileItem icon={Phone} label="Phone Number" value={profile.phone} />
                                <ProfileItem icon={MapPin} label="Home Address" value={profile.address} className="sm:col-span-2" />
                                <ProfileItem icon={Calendar} label="Nationality" value={profile.nationality} />
                                <ProfileItem icon={HeartPulse} label="Blood Group" value={profile.bloodGroup} />
                            </CardContent>
                        </Card>
                    </AnimatedWrapper>

                    <AnimatedWrapper delay={0.3}>
                        <Card className="glass-panel border-border/50">
                            <CardHeader>
                                <CardTitle className="heading-3 flex items-center gap-2 text-primary">
                                    <Briefcase className="h-5 w-5" />
                                    Occupation Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-2">
                                <ProfileItem icon={Briefcase} label="Occupation" value={profile.guardianOccupation} />
                                <ProfileItem icon={Users} label="Relation" value={profile.guardianRelation || "Parent"} />
                            </CardContent>
                        </Card>
                    </AnimatedWrapper>
                </div>
            </div>
        </div>
    )
}

function ProfileItem({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value?: string, className?: string }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Icon className="h-3 w-3" />
                {label}
            </label>
            <div className="px-3 py-2.5 rounded-xl border border-border/50 bg-background/50 text-sm font-medium shadow-sm">
                {value || "Not provided"}
            </div>
        </div>
    )
}
