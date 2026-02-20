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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const settingsSchema = z.object({
    schoolName: z.string().min(2, "School name is required"),
    schoolCode: z.string().min(2, "School code is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    contactNumber: z.string().min(10, "Valid contact number is required"),
    email: z.string().email("Invalid email address"),
    termStructure: z.string().min(1, "Please select term structure"),
    gradingSystem: z.string().min(1, "Please select grading system"),
    promotionThreshold: z.coerce.number().min(0).max(100),
    schoolHours: z.object({
        startTime: z.string(),
        endTime: z.string()
    }),
    maxClassesPerDay: z.coerce.number().min(1),
    portalPreferences: z.object({
        darkMode: z.boolean(),
        language: z.string(),
        timezone: z.string(),
        smsNotifications: z.boolean(),
        emailNotifications: z.boolean(),
    }),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

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

// Internal API base path
const API_BASE = "/api";

import { useRequireAuth } from "@/hooks/useRequireAuth"

export default function SchoolSettingsPage() {
    const { user, loading: authLoading } = useRequireAuth(['admin'])
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [settings, setSettings] = useState<SettingsFormValues | null>(null)
    const { setTheme, theme } = useTheme()

    const { toast } = useToast()

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            schoolName: "",
            schoolCode: "",
            address: "",
            contactNumber: "",
            email: "",
            termStructure: "2",
            gradingSystem: "percentage",
            promotionThreshold: 40,
            schoolHours: {
                startTime: "08:00 AM",
                endTime: "02:00 PM"
            },
            maxClassesPerDay: 8,
            portalPreferences: {
                darkMode: false,
                language: "en",
                timezone: "pk",
                smsNotifications: true,
                emailNotifications: true,
            }
        }
    })

    // Update theme when setting is fetched
    useEffect(() => {
        if (settings) {
            setTheme(settings.portalPreferences.darkMode ? "dark" : "light")
        }
    }, [settings, setTheme])

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock Settings Data
            const mockSettings: SettingsFormValues = {
                schoolName: "The Pioneers High School",
                schoolCode: "PHS-2026",
                address: "Plot 123, Academic Block, Sector 4, Islamabad, Pakistan",
                contactNumber: "+92 51 1234567",
                email: "info@thepioneers.edu.pk",
                termStructure: "2",
                gradingSystem: "percentage",
                promotionThreshold: 40,
                schoolHours: {
                    startTime: "08:00 AM",
                    endTime: "02:00 PM"
                },
                maxClassesPerDay: 8,
                portalPreferences: {
                    darkMode: false,
                    language: "en",
                    timezone: "pk",
                    smsNotifications: true,
                    emailNotifications: true,
                }
            };

            setSettings(mockSettings)
            form.reset(mockSettings)
        } catch (err: any) {
            console.error("Fetch error:", err)
            setError(err.message)
            toast({
                title: "Error",
                description: "Could not fetch school settings. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }, [toast, form])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const onSubmit = async (data: SettingsFormValues) => {
        setIsSaving(true)
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            toast({
                title: "Settings Updated",
                description: "Global configuration has been successfully synchronized.",
            })
            setSettings(data)
            setTheme(data.portalPreferences.darkMode ? "dark" : "light")
        } catch (err: any) {
            toast({
                title: "Update Failed",
                description: err.message || "An unexpected error occurred",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Admin"} userRole="admin">
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
            <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Admin"} userRole="admin">
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
        <AppLayout sidebarItems={sidebarItems} userName={user?.name || "Admin"} userRole="admin">
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                                        <FormField
                                                            control={form.control}
                                                            name="schoolName"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Institution Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} className="glass-card" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="schoolCode"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Institution Code</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} className="glass-card" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="address"
                                                            render={({ field }) => (
                                                                <FormItem className="md:col-span-2">
                                                                    <FormLabel>Official Address</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea {...field} className="glass-card min-h-[80px]" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="contactNumber"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Primary Contact Number</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} className="glass-card" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Official Email</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} className="glass-card" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
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
                                                <FormField
                                                    control={form.control}
                                                    name="termStructure"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Academic Terms per Year</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="glass-card">
                                                                        <SelectValue placeholder="Select terms" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="1">Annual System (1 Term)</SelectItem>
                                                                    <SelectItem value="2">Semester System (2 Terms)</SelectItem>
                                                                    <SelectItem value="3">Trimester System (3 Terms)</SelectItem>
                                                                    <SelectItem value="4">Quarterly System (4 Terms)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="gradingSystem"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Grading Methodology</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="glass-card">
                                                                        <SelectValue placeholder="Select system" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="percentage">Percentage based (0-100%)</SelectItem>
                                                                    <SelectItem value="relative">Relative Grading (Curved)</SelectItem>
                                                                    <SelectItem value="gpa">Standard GPA (4.0 Scale)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="schoolHours.startTime"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>School Start Time</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="glass-card" placeholder="e.g. 08:00 AM" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="schoolHours.endTime"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>School End Time</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="glass-card" placeholder="e.g. 03:00 PM" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="promotionThreshold"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Auto-Promotion Threshold (%)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} className="glass-card" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="maxClassesPerDay"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Max Classes per Day</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} className="glass-card" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
                                                <FormField
                                                    control={form.control}
                                                    name="portalPreferences.darkMode"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-primary/10">
                                                                    <Moon className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <FormLabel className="text-sm font-semibold">Default Dark Mode</FormLabel>
                                                                    <FormDescription className="text-xs text-muted-foreground">Force high-contrast dark theme for all users.</FormDescription>
                                                                </div>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="portalPreferences.language"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Primary Portal Language</FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="glass-card">
                                                                            <SelectValue placeholder="Select language" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="en">English (UK)</SelectItem>
                                                                        <SelectItem value="ar">Arabic (UAE)</SelectItem>
                                                                        <SelectItem value="ur">Urdu (PK)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="portalPreferences.timezone"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Default Timezone</FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="glass-card">
                                                                            <SelectValue placeholder="Select timezone" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="pk">(GMT+5) Karachi/Islamabad</SelectItem>
                                                                        <SelectItem value="ae">(GMT+4) Dubai/Abu Dhabi</SelectItem>
                                                                        <SelectItem value="uk">(GMT+0) London</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-border/50">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Notifications</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="portalPreferences.smsNotifications"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center gap-3 space-y-0">
                                                                    <FormControl>
                                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-medium">Automatic Attendance SMS to Parents</FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="portalPreferences.emailNotifications"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center gap-3 space-y-0">
                                                                    <FormControl>
                                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-medium">Result Publication Email</FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
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
                                type="submit"
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
                    </form>
                </Form>
            </div>
        </AppLayout>
    )
}
