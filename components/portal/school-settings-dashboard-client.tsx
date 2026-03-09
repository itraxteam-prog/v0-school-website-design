"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
    schoolLogo: z.string().optional(),
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

export function SchoolSettingsDashboardClient({ user }: { user: any }) {
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [settings, setSettings] = useState<SettingsFormValues | null>(null)
    const [previewLogo, setPreviewLogo] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { toast } = useToast()

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
        }
    })

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/admin/settings", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch settings");
            const data = await res.json();

            // Map array of key/value pairs to the form structure
            const mappedSettings: any = {
                schoolHours: { startTime: "08:00 AM", endTime: "02:00 PM" },
            };

            data.forEach((s: any) => {
                if (s.key.includes('.')) {
                    const [parent, child] = s.key.split('.');
                    if (!mappedSettings[parent]) mappedSettings[parent] = {};

                    // Specific logic for boolean or number conversion
                    if (s.value === 'true' || s.value === 'false') {
                        mappedSettings[parent][child] = s.value === 'true';
                    } else if (!isNaN(Number(s.value)) && !s.key.toLowerCase().includes('time') && s.key !== 'contactNumber') {
                        mappedSettings[parent][child] = Number(s.value);
                    } else {
                        mappedSettings[parent][child] = s.value;
                    }
                } else {
                    if (s.value === 'true' || s.value === 'false') {
                        mappedSettings[s.key] = s.value === 'true';
                    } else if (!isNaN(Number(s.value)) && s.key !== 'schoolCode' && s.key !== 'contactNumber' && !s.key.toLowerCase().includes('time')) {
                        mappedSettings[s.key] = Number(s.value);
                    } else {
                        mappedSettings[s.key] = s.value;
                    }
                }
            });

            setSettings(mappedSettings)
            form.reset(mappedSettings)
            if (mappedSettings.schoolLogo) {
                setPreviewLogo(mappedSettings.schoolLogo);
            }
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
    }, [toast, form.reset])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const onSubmit = async (data: SettingsFormValues) => {
        setIsSaving(true)
        try {
            // Flatten the settings for the API
            const flattened: any = {};
            const flatten = (obj: any, prefix = '') => {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        flatten(value, `${prefix}${key}.`);
                    } else {
                        flattened[`${prefix}${key}`] = String(value);
                    }
                });
            };
            flatten(data);
            const flattenedArray = Object.keys(flattened).map(key => ({
                key,
                value: String(flattened[key])
            }));

            const res = await fetch("/api/admin/settings", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(flattenedArray)
            });

            if (!res.ok) throw new Error("Failed to save settings");

            toast({
                title: "Settings Updated",
                description: "Global configuration has been successfully synchronized.",
            })
            setSettings(data)
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
                                                        <div
                                                            className="h-32 w-32 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center relative group overflow-hidden cursor-pointer shadow-inner"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            {previewLogo ? (
                                                                <img src={previewLogo} alt="School Logo" className="w-full h-full object-contain" />
                                                            ) : (
                                                                <div className="text-center p-4 group-hover:opacity-0 transition-opacity">
                                                                    <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upload Logo</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                                                                <Save className="h-6 w-6 mb-1" />
                                                                <span className="text-[10px] font-bold uppercase">Change</span>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        const base64String = reader.result as string;
                                                                        setPreviewLogo(base64String);
                                                                        form.setValue('schoolLogo', base64String);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
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
                                                                    <SelectItem value="2">Semester System (Term 1 & 2)</SelectItem>
                                                                    <SelectItem value="3">Trimester System (Term 1, 2 & 3)</SelectItem>
                                                                    <SelectItem value="12">Monthly Assessment (Monthly + Finals)</SelectItem>
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
                                                                    <SelectItem value="percentage">Percentage based (A, B, C...)</SelectItem>
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
