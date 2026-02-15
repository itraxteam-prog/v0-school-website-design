"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    School,
    BarChart3,
    FileBarChart,
    Settings,
    ShieldCheck,
    Camera,
    Save,
    Globe,
    Bell,
    Moon,
    BookOpen
} from "lucide-react"
import { motion } from "framer-motion"

const sidebarItems = [
    { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
    { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
    { href: "/portal/admin/classes", label: "Classes", icon: School },
    { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
    { href: "/portal/admin/users", label: "User Management", icon: Settings },
    { href: "/portal/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
    { href: "/portal/admin/school-settings", label: "School Settings", icon: Settings },
]

const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function SchoolSettingsPage() {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div>
                    <h1 className="heading-1 text-burgundy-gradient text-burgundy">School Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your institution's profile, academic rules, and portal preferences.</p>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="bg-muted/50 p-1 mb-6 glass-panel border-border/50 overflow-x-auto inline-flex whitespace-nowrap scrollbar-hide">
                        <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">General Info</TabsTrigger>
                        <TabsTrigger value="academic" className="data-[state=active]:bg-primary data-[state=active]:text-white">Academic Rules</TabsTrigger>
                        <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-white">Portal Preferences</TabsTrigger>
                    </TabsList>

                    <motion.div
                        variants={containerVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* General Info Section */}
                        <TabsContent value="general" className="space-y-6">
                            <motion.div variants={itemVariant}>
                                <Card className="glass-panel border-border/50">
                                    <CardHeader>
                                        <CardTitle className="heading-3 flex items-center gap-2">
                                            <School className="h-5 w-5 text-primary" />
                                            Institution Profile
                                        </CardTitle>
                                        <CardDescription>Update your school's public identity and contact details.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-32 w-32 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center relative group overflow-hidden cursor-pointer shadow-inner">
                                                    <div className="text-center p-4 group-hover:opacity-0 transition-opacity">
                                                        <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upload Logo</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                                                        <Save className="h-6 w-6 mb-1" />
                                                        <span className="text-[10px] font-bold uppercase">Change</span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground italic">Recommended: 512x512px. PNG/SVG.</p>
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="school-name">Institution Name</Label>
                                                    <Input id="school-name" defaultValue="Pioneers High School & College" className="glass-card" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="school-code">Institution Code</Label>
                                                    <Input id="school-code" defaultValue="PHS-2024" className="glass-card" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="address">Official Address</Label>
                                                    <Textarea id="address" defaultValue="Model Town, Phase II, Lahore, Pakistan" className="glass-card min-h-[80px]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contact">Primary Contact Number</Label>
                                                    <Input id="contact" defaultValue="+92 42 35123456" className="glass-card" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Official Email</Label>
                                                    <Input id="email" defaultValue="admin@pioneershigh.edu.pk" className="glass-card" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        {/* Academic Info Section */}
                        <TabsContent value="academic" className="space-y-6">
                            <motion.div variants={itemVariant}>
                                <Card className="glass-panel border-border/50">
                                    <CardHeader>
                                        <CardTitle className="heading-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                            Academic Configuration
                                        </CardTitle>
                                        <CardDescription>Define terms, grading systems, and classroom structure.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Academic Terms per Year</Label>
                                            <Select defaultValue="3">
                                                <SelectTrigger className="glass-card">
                                                    <SelectValue placeholder="Select terms" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Annual System (1 Term)</SelectItem>
                                                    <SelectItem value="2">Semester System (2 Terms)</SelectItem>
                                                    <SelectItem value="3">Trimester System (3 Terms)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Grading Methodology</Label>
                                            <Select defaultValue="relative">
                                                <SelectTrigger className="glass-card">
                                                    <SelectValue placeholder="Select system" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percentage">Percentage based (0-100%)</SelectItem>
                                                    <SelectItem value="relative">Relative Grading (Curved)</SelectItem>
                                                    <SelectItem value="gpa">Standard GPA (4.0 Scale)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Class Naming Convention</Label>
                                            <Select defaultValue="grade-section">
                                                <SelectTrigger className="glass-card">
                                                    <SelectValue placeholder="Select convention" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="grade-section">Grade + Section (e.g. 10-A)</SelectItem>
                                                    <SelectItem value="year-group">Year Group (e.g. Year 10)</SelectItem>
                                                    <SelectItem value="custom">Custom Naming</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Auto-Promotion Threshold (%)</Label>
                                            <Input type="number" defaultValue="40" className="glass-card" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        {/* Preferences Section */}
                        <TabsContent value="preferences" className="space-y-6">
                            <motion.div variants={itemVariant}>
                                <Card className="glass-panel border-border/50">
                                    <CardHeader>
                                        <CardTitle className="heading-3 flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-primary" />
                                            Portal Preferences
                                        </CardTitle>
                                        <CardDescription>Global defaults for student and teacher dashboards.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Moon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">Default Dark Mode</p>
                                                    <p className="text-xs text-muted-foreground">Force high-contrast dark theme for all users.</p>
                                                </div>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Primary Portal Language</Label>
                                                <Select defaultValue="en">
                                                    <SelectTrigger className="glass-card">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="en">English (UK)</SelectItem>
                                                        <SelectItem value="ar">Arabic (UAE)</SelectItem>
                                                        <SelectItem value="ur">Urdu (PK)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Default Timezone</Label>
                                                <Select defaultValue="pk">
                                                    <SelectTrigger className="glass-card">
                                                        <SelectValue placeholder="Select timezone" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pk">(GMT+5) Karachi/Islamabad</SelectItem>
                                                        <SelectItem value="ae">(GMT+4) Dubai/Abu Dhabi</SelectItem>
                                                        <SelectItem value="uk">(GMT+0) London</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border/50">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Notifications</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Switch defaultValue="on" />
                                                    <span className="text-sm font-medium">Automatic Attendance SMS to Parents</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Switch defaultValue="on" />
                                                    <span className="text-sm font-medium">Result Publication Email</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </motion.div>
                </Tabs>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        className="bg-primary text-white hover:bg-primary/90 px-10 h-12 shadow-burgundy-glow transition-all active:scale-95 flex items-center gap-2"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Synchronizing Configuration..." : "Apply Global Settings"}
                    </Button>
                </div>
            </div>
        </AppLayout>
    )
}
