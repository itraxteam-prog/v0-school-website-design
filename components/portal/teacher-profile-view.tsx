"use client"

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
    ShieldCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useSession } from "next-auth/react"
import { TEACHER_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

interface TeacherProfileViewProps {
    teacherData: any;
}

export function TeacherProfileView({ teacherData }: TeacherProfileViewProps) {
    const { data: session } = useSession()
    return (
        <AppLayout sidebarItems={sidebarItems} userName={session?.user?.name || teacherData.name} userRole="teacher">
            <div className="flex flex-col gap-8 pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="heading-2 text-burgundy-gradient">My Profile</h1>
                        <p className="text-sm text-muted-foreground">Manage your personal and professional information.</p>
                    </div>
                    <Button variant="outline" className="border-primary/20 text-primary flex items-center gap-2" onClick={() => toast.info("Profile editing is restricted.")}>
                        <Edit size={16} /> Edit Profile
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <Card className="glass-panel border-border/50 overflow-hidden">
                            <CardContent className="p-6 flex flex-col items-center gap-6">
                                <div className="relative group">
                                    <div className="flex h-40 w-40 items-center justify-center rounded-full bg-burgundy-gradient text-white text-5xl font-bold shadow-2xl ring-4 ring-white/20">
                                        {teacherData.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={18} /></button>
                                </div>
                                <div className="text-center space-y-1">
                                    <h2 className="heading-3 text-xl">{teacherData.name}</h2>
                                    <div className="flex items-center justify-center gap-1.5 text-primary font-medium text-sm"><BadgeCheck size={16} /> {teacherData.designation}</div>
                                </div>
                                <div className="w-full pt-4 border-t border-border/50">
                                    <div className="flex justify-between text-sm py-2"><span className="text-muted-foreground">ID</span><span className="font-semibold">{teacherData.id}</span></div>
                                    <div className="flex justify-between text-sm py-2"><span className="text-muted-foreground">Status</span><Badge variant="outline" className="bg-green-50 text-green-700">{teacherData.status}</Badge></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        <ProfileInfoSection title="Basic Information" icon={<User size={20} className="text-primary" />}>
                            <InfoItem label="Full Name" value={teacherData.name} />
                            <InfoItem label="Date of Birth" value={teacherData.dob} />
                            <InfoItem label="Gender" value={teacherData.gender} />
                            <InfoItem label="Employee ID" value={teacherData.id} />
                        </ProfileInfoSection>

                        <ProfileInfoSection title="Professional Info" icon={<GraduationCap size={20} className="text-primary" />}>
                            <InfoItem label="Qualifications" value={teacherData.qualifications} />
                            <InfoItem label="Subjects" value={teacherData.subjects} />
                            <InfoItem label="Classes" value={teacherData.classes} />
                            <InfoItem label="Joining Date" value={teacherData.joiningDate} />
                        </ProfileInfoSection>

                        <ProfileInfoSection title="Contact Details" icon={<Mail size={20} className="text-primary" />}>
                            <InfoItem label="Email" value={teacherData.email} />
                            <InfoItem label="Phone" value={teacherData.phone} />
                            <InfoItem label="Address" value={teacherData.address} fullWidth />
                        </ProfileInfoSection>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

function ProfileInfoSection({ title, icon, children }: any) {
    return (
        <Card className="glass-panel border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/50">
                <CardTitle className="heading-3 text-lg flex items-center gap-2">{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid gap-6 sm:grid-cols-2">{children}</CardContent>
        </Card>
    )
}

function InfoItem({ label, value, fullWidth = false }: any) {
    return (
        <div className={cn("flex flex-col gap-2", fullWidth && "sm:col-span-2")}>
            <span className="text-xs font-bold text-muted-foreground uppercase">{label}</span>
            <div className="rounded-lg border bg-muted/40 p-3.5 text-sm font-medium">{value}</div>
        </div>
    )
}
