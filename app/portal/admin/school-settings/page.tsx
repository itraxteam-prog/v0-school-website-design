"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
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
    BookOpen,
    Clock,
    Loader2,
    AlertCircle,
    RefreshCcw
} from "lucide-react"
import { motion } from "framer-motion"

const sidebarItems = [
    { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
    { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
    { href: "/portal/admin/classes", label: "Classes", icon: School },
    { href: "/portal/admin/periods", label: "Periods", icon: Clock },
    { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
    { href: "/portal/admin/users", label: "User Management", icon: Settings },
    { href: "/portal/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
    { href: "/portal/admin/school-settings", label: "School Settings", icon: Settings },
]

interface SchoolSettings {
    schoolName: string;
    schoolCode: string;
    address: string;
    contactNumber: string;
    email: string;
    termStructure: string;
    gradingSystem: string;
    promotionThreshold: number;
    schoolHours: {
        startTime: string;
        endTime: string;
    };
    maxClassesPerDay: number;
    portalPreferences: {
        darkMode: boolean;
        language: string;
        timezone: string;
        smsNotifications: boolean;
        emailNotifications: boolean;
    };
}

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SchoolSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [settings, setSettings] = useState<SchoolSettings | null>(null)

    const { toast } = useToast()

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_URL}/settings`)
            if (!response.ok) throw new Error("Failed to load settings")
            const responseData = await response.json()
            setSettings(responseData.data || responseData)
        } catch (err: any) {
            console.error("Fetch error:", err)
            setError(err.message)
            toast({
                title: "Error",
                description: "Could not fetch school settings. Please check your connection.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const handleSave = async () => {
        if (!settings) return

        setIsSaving(true)
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            })

            if (!response.ok) throw new Error("Failed to update settings")

            toast({
                title: "Settings Updated",
                description: "Global configuration has been successfully synchronized.",
            })
        } catch (err: any) {
            toast({
                title: "Update Failed",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const updateNestedField = (path: string, value: any) => {
        if (!settings) return
        const keys = path.split('.')
        const newSettings = JSON.parse(JSON.stringify(settings))
        let current: any = newSettings
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        setSettings(newSettings)
    }

    if (loading) {
        return (
            <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
                <div className="flex flex-col gap-8 pb-10">
                    <div>
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-full max-w-md rounded-xl" />
                        <Card className="glass-panel border-border/50">
                            <CardHeader>
                                <Skeleton className="h-8 w-48 mb-2" />
                                <Skeleton className="h-4 w-80" />
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <Skeleton className="h-32 w-32 rounded-2xl" />
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <Skeleton key={i} className="h-12 w-full" />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (error) {
        return (
            <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Connection Error</h2>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                    <Button onClick={fetchSettings} className="gap-2 bg-primary text-white">
                        <RefreshCcw className="h-4 w-4" /> Try Again
                    </Button>
                </div>
            </AppLayout>
        )
    }

    if (!settings) return null

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient text-burgundy">School Settings</h1>
                        <p className="text-sm text-muted-foreground">Manage your institution's profile, academic rules, and portal preferences.</p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchSettings}
                        className="h-10 w-10 glass-panel"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
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
                                                    <Input
                                                        id="school-name"
                                                        value={settings.schoolName}
                                                        onChange={(e) => updateNestedField('schoolName', e.target.value)}
                                                        className="glass-card"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="school-code">Institution Code</Label>
                                                    <Input
                                                        id="school-code"
                                                        value={settings.schoolCode}
                                                        onChange={(e) => updateNestedField('schoolCode', e.target.value)}
                                                        className="glass-card"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="address">Official Address</Label>
                                                    <Textarea
                                                        id="address"
                                                        value={settings.address}
                                                        onChange={(e) => updateNestedField('address', e.target.value)}
                                                        className="glass-card min-h-[80px]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contact">Primary Contact Number</Label>
                                                    <Input
                                                        id="contact"
                                                        value={settings.contactNumber}
                                                        onChange={(e) => updateNestedField('contactNumber', e.target.value)}
                                                        className="glass-card"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Official Email</Label>
                                                    <Input
                                                        id="email"
                                                        value={settings.email}
                                                        onChange={(e) => updateNestedField('email', e.target.value)}
                                                        className="glass-card"
                                                    />
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
                                            <Select
                                                value={settings.termStructure}
                                                onValueChange={(val) => updateNestedField('termStructure', val)}
                                            >
                                                <SelectTrigger className="glass-card">
                                                    <SelectValue placeholder="Select terms" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Annual System (1 Term)</SelectItem>
                                                    <SelectItem value="2">Semester System (2 Terms)</SelectItem>
                                                    <SelectItem value="3">Trimester System (3 Terms)</SelectItem>
                                                    <SelectItem value="4">Quarterly System (4 Terms)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Grading Methodology</Label>
                                            <Select
                                                value={settings.gradingSystem}
                                                onValueChange={(val) => updateNestedField('gradingSystem', val)}
                                            >
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
                                            <Label>School Start Time</Label>
                                            <Input
                                                type="text"
                                                value={settings.schoolHours.startTime}
                                                onChange={(e) => updateNestedField('schoolHours.startTime', e.target.value)}
                                                className="glass-card"
                                                placeholder="e.g. 08:00 AM"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>School End Time</Label>
                                            <Input
                                                type="text"
                                                value={settings.schoolHours.endTime}
                                                onChange={(e) => updateNestedField('schoolHours.endTime', e.target.value)}
                                                className="glass-card"
                                                placeholder="e.g. 03:00 PM"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Auto-Promotion Threshold (%)</Label>
                                            <Input
                                                type="number"
                                                value={settings.promotionThreshold}
                                                onChange={(e) => updateNestedField('promotionThreshold', parseInt(e.target.value) || 0)}
                                                className="glass-card"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Max Classes per Day</Label>
                                            <Input
                                                type="number"
                                                value={settings.maxClassesPerDay}
                                                onChange={(e) => updateNestedField('maxClassesPerDay', parseInt(e.target.value) || 0)}
                                                className="glass-card"
                                            />
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
                                            <Switch
                                                checked={settings.portalPreferences.darkMode}
                                                onCheckedChange={(val) => updateNestedField('portalPreferences.darkMode', val)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Primary Portal Language</Label>
                                                <Select
                                                    value={settings.portalPreferences.language}
                                                    onValueChange={(val) => updateNestedField('portalPreferences.language', val)}
                                                >
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
                                                <Select
                                                    value={settings.portalPreferences.timezone}
                                                    onValueChange={(val) => updateNestedField('portalPreferences.timezone', val)}
                                                >
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
                                                    <Switch
                                                        checked={settings.portalPreferences.smsNotifications}
                                                        onCheckedChange={(val) => updateNestedField('portalPreferences.smsNotifications', val)}
                                                    />
                                                    <span className="text-sm font-medium">Automatic Attendance SMS to Parents</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={settings.portalPreferences.emailNotifications}
                                                        onCheckedChange={(val) => updateNestedField('portalPreferences.emailNotifications', val)}
                                                    />
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
                        onClick={() => handleSave()}
                        className="bg-primary text-white hover:bg-primary/90 px-10 h-12 shadow-burgundy-glow transition-all active:scale-95 flex items-center gap-2"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
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
