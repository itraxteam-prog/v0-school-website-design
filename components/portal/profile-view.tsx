"use client"
import { useState } from "react"

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

interface ProfileViewProps {
    data: any;
    sidebarItems?: any[];
    userRole?: string;
}

export function ProfileView({ data: initialData, sidebarItems: propSidebarItems, userRole = "teacher" }: ProfileViewProps) {
    const finalSidebarItems = propSidebarItems || sidebarItems;
    const { data: session, update } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState(initialData) // Renamed teacherData to profileData
    const [formData, setFormData] = useState({
        name: initialData.name,
        phone: initialData.phone,
        address: initialData.address,
        qualifications: initialData.qualifications,
        gender: initialData.gender,
        dob: initialData.dob
    })

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            toast.loading("Uploading photo...");
            const res = await fetch("/api/user/photo", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const result = await res.json();

            setProfileData((prev: any) => ({ ...prev, avatarUrl: result.url })); // Renamed setTeacherData to setProfileData
            toast.dismiss();
            toast.success("Photo updated successfully");
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to upload photo");
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    academicHistory: formData.qualifications, // mapping to academicHistory for now
                    gender: formData.gender,
                    dateOfBirth: formData.dob
                })
            });

            if (!res.ok) throw new Error("Update failed");

            setProfileData((prev: any) => ({ ...prev, ...formData })); // Renamed setTeacherData to setProfileData
            setIsEditing(false);
            toast.success("Profile updated successfully");
            // Update session if name changed
            if (formData.name !== session?.user?.name) {
                update({ name: formData.name });
            }
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout sidebarItems={finalSidebarItems} userName={session?.user?.name || profileData.name} userRole={userRole}>
            <div className="flex flex-col gap-8 pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="heading-2 text-burgundy-gradient">My Profile</h1>
                        <p className="text-sm text-muted-foreground">Manage your personal and professional information.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isEditing ? "ghost" : "outline"}
                            className={cn("border-primary/20 text-primary flex items-center gap-2", isEditing && "text-muted-foreground")}
                            onClick={() => {
                                if (isEditing) {
                                    setFormData({
                                        name: profileData.name,
                                        phone: profileData.phone,
                                        address: profileData.address,
                                        qualifications: profileData.qualifications,
                                        gender: profileData.gender,
                                        dob: profileData.dob
                                    });
                                }
                                setIsEditing(!isEditing);
                            }}
                        >
                            <Edit size={16} /> {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                        {isEditing && (
                            <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2" onClick={handleSave} disabled={loading}>
                                <BadgeCheck size={16} /> Save Changes
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <Card className="glass-panel border-border/50 overflow-hidden">
                            <CardContent className="p-6 flex flex-col items-center gap-6">
                                <div className="relative group">
                                    {profileData.avatarUrl ? (
                                        <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                                            <img src={profileData.avatarUrl} alt={profileData.name} className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-burgundy-gradient text-white text-5xl font-bold shadow-2xl ring-4 ring-white/20">
                                            {profileData.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <input type="file" id="profile-photo" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                    <button
                                        className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => document.getElementById('profile-photo')?.click()}
                                    >
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <div className="text-center space-y-1">
                                    <h2 className="heading-3 text-xl">{profileData.name}</h2>
                                    <div className="flex items-center justify-center gap-1.5 text-primary font-medium text-sm"><BadgeCheck size={16} /> {profileData.designation}</div>
                                </div>
                                <div className="w-full pt-4 border-t border-border/50">
                                    <div className="flex justify-between text-sm py-2"><span className="text-muted-foreground">ID</span><span className="font-semibold">{profileData.id}</span></div>
                                    <div className="flex justify-between text-sm py-2"><span className="text-muted-foreground">Status</span><Badge variant="outline" className="bg-green-50 text-green-700">{profileData.status}</Badge></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        <ProfileInfoSection title="Basic Information" icon={<User size={20} className="text-primary" />}>
                            <InfoItem
                                label="Full Name"
                                value={profileData.name}
                                isEditing={isEditing}
                                name="name"
                                onChange={(val: string) => setFormData(f => ({ ...f, name: val }))}
                                val={formData.name}
                            />
                            <InfoItem
                                label="Date of Birth"
                                value={profileData.dob}
                                isEditing={isEditing}
                                name="dob"
                                onChange={(val: string) => setFormData(f => ({ ...f, dob: val }))}
                                val={formData.dob}
                            />
                            <InfoItem
                                label="Gender"
                                value={profileData.gender}
                                isEditing={isEditing}
                                name="gender"
                                onChange={(val: string) => setFormData(f => ({ ...f, gender: val }))}
                                val={formData.gender}
                            />
                            <InfoItem label="Employee ID" value={profileData.id} />
                        </ProfileInfoSection>

                        <ProfileInfoSection title="Professional Info" icon={<GraduationCap size={20} className="text-primary" />}>
                            <InfoItem
                                label="Qualifications"
                                value={profileData.qualifications}
                                isEditing={isEditing}
                                name="qualifications"
                                onChange={(val: string) => setFormData(f => ({ ...f, qualifications: val }))}
                                val={formData.qualifications}
                            />
                            <InfoItem label="Subjects" value={profileData.subjects} />
                            <InfoItem label="Classes" value={profileData.classes} />
                            <InfoItem label="Joining Date" value={profileData.joiningDate} />
                        </ProfileInfoSection>

                        <ProfileInfoSection title="Contact Details" icon={<Mail size={20} className="text-primary" />}>
                            <InfoItem label="Email" value={profileData.email} />
                            <InfoItem
                                label="Phone"
                                value={profileData.phone}
                                isEditing={isEditing}
                                name="phone"
                                onChange={(val: string) => setFormData(f => ({ ...f, phone: val }))}
                                val={formData.phone}
                            />
                            <InfoItem
                                label="Address"
                                value={profileData.address}
                                fullWidth
                                isEditing={isEditing}
                                name="address"
                                onChange={(val: string) => setFormData(f => ({ ...f, address: val }))}
                                val={formData.address}
                            />
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

function InfoItem({ label, value, fullWidth = false, isEditing = false, onChange, val }: any) {
    return (
        <div className={cn("flex flex-col gap-2", fullWidth && "sm:col-span-2")}>
            <span className="text-xs font-bold text-muted-foreground uppercase">{label}</span>
            {isEditing && onChange ? (
                <input
                    className="rounded-lg border bg-background px-3.5 py-2.5 text-sm font-medium focus:outline-primary"
                    value={val || ""}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="rounded-lg border bg-muted/40 p-3.5 text-sm font-medium">{value}</div>
            )}
        </div>
    )
}
