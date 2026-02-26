"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Plus,
    Megaphone,
    Trash2,
    Calendar,
    Loader2,
    RefreshCcw,
    Search
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AppLayout } from "@/components/layout/app-layout"
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"
import { Badge } from "@/components/ui/badge"

const announcementSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    content: z.string().min(10, { message: "Content must be at least 10 characters." }),
    targetRole: z.enum(["ALL", "STUDENT", "TEACHER", "ADMIN"]),
    expiresAt: z.string().optional(),
})

type AnnouncementFormValues = z.infer<typeof announcementSchema>

interface Announcement {
    id: string;
    title: string;
    content: string;
    targetRole: string;
    createdAt: string;
    expiresAt?: string | null;
    author?: { name: string | null };
}

interface AnnouncementsManagerProps {
    initialAnnouncements: any[];
}

export function AnnouncementsManager({ initialAnnouncements }: AnnouncementsManagerProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            content: "",
            targetRole: "ALL",
            expiresAt: "",
        },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/admin/announcements")
            if (!response.ok) throw new Error("Failed to fetch announcements")
            const data = await response.json()
            setAnnouncements(data)
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const onSubmit = async (data: AnnouncementFormValues) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/admin/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to create announcement")

            toast({ title: "Success", description: "Announcement created successfully." })
            setIsModalOpen(false)
            form.reset()
            fetchData()
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return

        try {
            const response = await fetch(`/api/admin/announcements/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete announcement")

            toast({ title: "Deleted", description: "Announcement removed." })
            fetchData()
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" })
        }
    }

    const filtered = announcements.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Admin" userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="heading-1 text-burgundy-gradient">Announcements</h1>
                            <p className="text-sm text-muted-foreground">Broadcast updates to students and staff.</p>
                        </div>

                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                    <Plus className="h-4 w-4" />
                                    New Announcement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] glass-panel border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="heading-3">Create Announcement</DialogTitle>
                                    <DialogDescription>Fill in the details for your school broadcast.</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Annual Sports Day 2026" {...field} className="glass-card" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Content</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Details of the announcement..." {...field} className="glass-card min-h-[120px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="targetRole"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Target Audience</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="glass-card">
                                                                    <SelectValue placeholder="Select audience" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="ALL">Everyone</SelectItem>
                                                                <SelectItem value="STUDENT">Students Only</SelectItem>
                                                                <SelectItem value="TEACHER">Teachers Only</SelectItem>
                                                                <SelectItem value="ADMIN">Admins Only</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="expiresAt"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Expiry Date (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} className="glass-card" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 min-w-[120px]">
                                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.1}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search announcements..."
                                className="h-11 pl-9 glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={fetchData} className="h-11 w-11 glass-card">
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.2}>
                    <Card className="glass-panel border-border/50 overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-border/50">
                                        <TableHead className="pl-6 uppercase text-[10px] font-bold">Announcement</TableHead>
                                        <TableHead className="uppercase text-[10px] font-bold">Target</TableHead>
                                        <TableHead className="uppercase text-[10px] font-bold">Author</TableHead>
                                        <TableHead className="uppercase text-[10px] font-bold">Date</TableHead>
                                        <TableHead className="pr-6 text-right uppercase text-[10px] font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={i} className="border-border/50">
                                                <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filtered.length > 0 ? (
                                        filtered.map((a) => (
                                            <TableRow key={a.id} className="border-border/50 hover:bg-primary/5 transition-colors group">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{a.title}</span>
                                                        <span className="text-xs text-muted-foreground line-clamp-1">{a.content}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20 text-primary bg-primary/5">
                                                        {a.targetRole}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">{a.author?.name || "Admin"}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                                                        {new Date(a.createdAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(a.id)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                                No announcements found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}
