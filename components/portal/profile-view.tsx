"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useSession } from "next-auth/react"
import { TEACHER_SIDEBAR, ADMIN_SIDEBAR, STUDENT_SIDEBAR } from "@/lib/navigation-config"

interface ProfileViewProps {
    data: any;
    sidebarItems?: any[];
    userRole?: string;
}

export function ProfileView({ data: initialData, sidebarItems: propSidebarItems, userRole = "teacher" }: ProfileViewProps) {
    let defaultSidebar: any[] = TEACHER_SIDEBAR;
    if (userRole === "admin") defaultSidebar = ADMIN_SIDEBAR;
    if (userRole === "student") defaultSidebar = STUDENT_SIDEBAR;

    const finalSidebarItems = propSidebarItems || defaultSidebar;
    const { data: session, update } = useSession()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState(initialData)
    const [formData, setFormData] = useState({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        qualifications: initialData.qualifications,
        gender: initialData.gender,
        dob: initialData.dob,
        subjects: initialData.subjects,
        classes: initialData.classes,
        status: initialData.status,
        designation: initialData.designation,
        rollNumber: initialData.id,
    })

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Use FileReader to convert to base64 (to work on Vercel)
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                toast.loading("Uploading photo...");
                const res = await fetch("/api/user/photo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64String }),
                });

                if (!res.ok) throw new Error("Upload failed");
                const result = await res.json();

                setProfileData((prev: any) => ({ ...prev, avatarUrl: result.url }));

                // Update session so header avatar updates
                await update({ image: result.url });
                router.refresh();

                toast.dismiss();
                toast.success("Photo updated successfully");
            } catch (err) {
                toast.dismiss();
                toast.error("Failed to upload photo");
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    qualifications: formData.qualifications,
                    gender: formData.gender,
                    dateOfBirth: formData.dob,
                    subjects: formData.subjects,
                    classes: formData.classes,
                    status: formData.status,
                    designation: formData.designation,
                    rollNumber: formData.rollNumber
                })
            });

            if (!res.ok) throw new Error("Update failed");

            // Update local state and ensure ID reflects Roll Number
            const updatedProfile = { ...profileData, ...formData, id: formData.rollNumber };
            setProfileData(updatedProfile);

            setIsEditing(false);
            toast.success("Profile updated successfully");

            // Update session if name changed
            if (formData.name !== session?.user?.name) {
                await update({ name: formData.name });
            }
            router.refresh();
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                                    // Reset form data to last saved profile data
                                    setFormData({
                                        name: profileData.name,
                                        email: profileData.email,
                                        phone: profileData.phone,
                                        address: profileData.address,
                                        qualifications: profileData.qualifications,
                                        gender: profileData.gender,
                                        dob: profileData.dob,
                                        subjects: profileData.subjects,
                                        classes: profileData.classes,
                                        status: profileData.status,
                                        designation: profileData.designation,
                                        rollNumber: profileData.id // ID maps to rollNumber
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
                                            {(profileData?.name || "User").substring(0, 2).toUpperCase()}
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
                                    <div className="flex items-center justify-center gap-1.5 text-primary font-medium text-sm">
                                        <BadgeCheck size={16} />
                                        {isEditing ? (
                                            <input
                                                className="bg-transparent border-b border-primary/30 text-center focus:outline-none focus:border-primary"
                                                value={formData.designation}
                                                onChange={(e) => setFormData(f => ({ ...f, designation: e.target.value }))}
                                            />
                                        ) : profileData.designation}
                                    </div>
                                </div>
                                <div className="w-full pt-4 border-t border-border/50">
                                    <div className="flex justify-between text-sm py-2"><span className="text-muted-foreground">ID</span><span className="font-semibold">{profileData.id}</span></div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-muted-foreground">Status</span>
                                        {isEditing ? (
                                            <select
                                                className="text-xs bg-muted rounded px-1"
                                                value={formData.status}
                                                onChange={(e) => setFormData(f => ({ ...f, status: e.target.value }))}
                                            >
                                                <option value="ACTIVE">ACTIVE</option>
                                                <option value="SUSPENDED">SUSPENDED</option>
                                            </select>
                                        ) : (
                                            <Badge variant="outline" className={cn("bg-green-50 text-green-700", profileData.status !== 'ACTIVE' && "bg-red-50 text-red-700")}>
                                                {profileData.status}
                                            </Badge>
                                        )}
                                    </div>
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
                                type="date"
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
                            <InfoItem
                                label="Employee ID / Roll Number"
                                value={profileData.id}
                                isEditing={isEditing}
                                name="rollNumber"
                                onChange={(val: string) => setFormData(f => ({ ...f, rollNumber: val }))}
                                val={formData.rollNumber}
                            />
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
                            <InfoItem
                                label="Subjects"
                                value={profileData.subjects}
                                isEditing={isEditing}
                                name="subjects"
                                onChange={(val: string) => setFormData(f => ({ ...f, subjects: val }))}
                                val={formData.subjects}
                            />
                            <InfoItem
                                label="Classes"
                                value={profileData.classes}
                                isEditing={isEditing}
                                name="classes"
                                onChange={(val: string) => setFormData(f => ({ ...f, classes: val }))}
                                val={formData.classes}
                            />
                            <InfoItem label="Joining Date" value={formatDateDisplay(profileData.joiningDate)} />
                        </ProfileInfoSection>

                        <ProfileInfoSection title="Contact Details" icon={<Mail size={20} className="text-primary" />}>
                            <InfoItem
                                label="Email"
                                value={profileData.email}
                                isEditing={isEditing}
                                name="email"
                                onChange={(val: string) => setFormData(f => ({ ...f, email: val }))}
                                val={formData.email}
                            />
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
    );
}

function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "Not set";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return dateStr;
    }
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

function InfoItem({ label, value, fullWidth = false, isEditing = false, onChange, val, type = "text" }: any) {
    const displayValue = type === "date" ? formatDateDisplay(value) : value;

    return (
        <div className={cn("flex flex-col gap-2", fullWidth && "sm:col-span-2")}>
            <span className="text-xs font-bold text-muted-foreground uppercase">{label}</span>
            {isEditing && onChange ? (
                <input
                    type={type}
                    className="rounded-lg border bg-background px-3.5 py-2.5 text-sm font-medium focus:outline-primary w-full h-[46px]"
                    value={val || ""}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="rounded-lg border bg-muted/40 p-3.5 text-sm font-medium min-h-[46px] flex items-center">
                    {displayValue}
                </div>
            )}
        </div>
    )
}
