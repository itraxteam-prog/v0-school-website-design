"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
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
    FormDescription,
} from "@/components/ui/form"
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    School,
    BarChart3,
    FileBarChart,
    Settings,
    ShieldCheck,
    Plus,
    Search,
    ChevronUp,
    ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const sidebarItems = [
    { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
    { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
    { href: "/portal/admin/classes", label: "Classes", icon: School },
    { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
    { href: "/portal/admin/users", label: "User Management", icon: Settings },
    { href: "/portal/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
]

const roleSchema = z.object({
    name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
    description: z.string().min(5, { message: "Description must be at least 5 characters." }),
    permissions: z.object({
        view: z.boolean().default(false),
        create: z.boolean().default(false),
        edit: z.boolean().default(false),
        delete: z.boolean().default(false),
    }),
})

type RoleFormValues = z.infer<typeof roleSchema>

const initialRoles = [
    {
        id: 1,
        name: "System Admin",
        description: "Full access to all modules and settings.",
        permissions: { view: true, create: true, edit: true, delete: true },
        status: "Active",
    },
    {
        id: 2,
        name: "Academic Manager",
        description: "Manages classes, teachers, and curriculum.",
        permissions: { view: true, create: true, edit: true, delete: false },
        status: "Active",
    },
    {
        id: 3,
        name: "Teacher",
        description: "Standard access to assigned classes and students.",
        permissions: { view: true, create: false, edit: true, delete: false },
        status: "Active",
    },
    {
        id: 4,
        name: "Student",
        description: "Read-only access to portal resources.",
        permissions: { view: true, create: false, edit: false, delete: false },
        status: "Active",
    },
    {
        id: 5,
        name: "Guest",
        description: "Limited temporal access for parents/volunteers.",
        permissions: { view: true, create: false, edit: false, delete: false },
        status: "Inactive",
    },
]

export default function RolesPermissionsPage() {
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [roles, setRoles] = useState(initialRoles)
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: {
                view: true,
                create: false,
                edit: false,
                delete: false,
            },
        },
    })

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc"
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })

        const sortedRoles = [...roles].sort((a, b) => {
            if (a[key as keyof typeof a] < b[key as keyof typeof b]) return direction === "asc" ? -1 : 1
            if (a[key as keyof typeof a] > b[key as keyof typeof b]) return direction === "asc" ? 1 : -1
            return 0
        })
        setRoles(sortedRoles)
    }

    const togglePermission = (roleId: number, permission: keyof typeof roles[0]["permissions"]) => {
        setRoles(roles.map(role => {
            if (role.id === roleId) {
                return {
                    ...role,
                    permissions: {
                        ...role.permissions,
                        [permission]: !role.permissions[permission]
                    }
                }
            }
            return role
        }))
    }

    const onSubmit = (data: RoleFormValues) => {
        const newRole = {
            id: roles.length + 1,
            ...data,
            status: "Active",
        }
        setRoles([...roles, newRole])
        setIsAddModalOpen(false)
        form.reset()
    }

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
            <div className="flex flex-col gap-8 pb-8">

                {/* Header Section */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Roles & Permissions</h1>
                        <p className="text-sm text-muted-foreground">Define and manage access control levels for the entire institution.</p>
                    </div>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow h-11 px-6 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add New Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl glass-panel border-border/50">
                            <DialogHeader>
                                <DialogTitle className="heading-3">Define New Role</DialogTitle>
                                <DialogDescription>
                                    Configure a new access level with specific granular permissions.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Librarian, IT Admin" {...field} className="glass-card h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Brief explanation of responsibilities" {...field} className="glass-card h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.keys(form.getValues().permissions).map((perm) => (
                                            <FormField
                                                key={perm}
                                                control={form.control}
                                                name={`permissions.${perm as keyof RoleFormValues["permissions"]}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-3 bg-muted/5 shadow-sm">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm capitalize">{perm}</FormLabel>
                                                            <FormDescription className="text-[10px]">Grant {perm} access</FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="data-[state=checked]:bg-primary"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <DialogFooter className="pt-2">
                                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow px-8">Define Role</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search roles or descriptions..."
                        className="h-11 pl-9 glass-card shadow-sm focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Roles Table */}
                <Card className="glass-panel border-border/50 overflow-hidden shadow-xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-10 w-full rounded-md" />
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full rounded-md" />
                                    ))}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead
                                                className="pl-8 py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground cursor-pointer group"
                                                onClick={() => handleSort("name")}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Role Name
                                                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronUp className={`h-3 w-3 ${sortConfig?.key === "name" && sortConfig.direction === "asc" ? "text-primary" : ""}`} />
                                                        <ChevronDown className={`h-3 w-3 ${sortConfig?.key === "name" && sortConfig.direction === "desc" ? "text-primary" : ""}`} />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead className="py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Description</TableHead>
                                            <TableHead className="py-4 text-center font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Permissions (V/C/E/D)</TableHead>
                                            <TableHead
                                                className="pr-8 py-4 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground cursor-pointer group"
                                                onClick={() => handleSort("status")}
                                            >
                                                <div className="flex items-center justify-end gap-2">
                                                    Status
                                                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronUp className={`h-3 w-3 ${sortConfig?.key === "status" && sortConfig.direction === "asc" ? "text-primary" : ""}`} />
                                                        <ChevronDown className={`h-3 w-3 ${sortConfig?.key === "status" && sortConfig.direction === "desc" ? "text-primary" : ""}`} />
                                                    </div>
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="popLayout">
                                            {filteredRoles.length > 0 ? (
                                                filteredRoles.map((role) => (
                                                    <motion.tr
                                                        key={role.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-border/40 hover:bg-primary/5 transition-colors group relative"
                                                    >
                                                        <TableCell className="pl-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                                <span className="font-bold text-foreground">{role.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-5 text-sm text-muted-foreground max-w-xs truncate">
                                                            {role.description}
                                                        </TableCell>
                                                        <TableCell className="py-5">
                                                            <div className="flex items-center justify-center gap-6">
                                                                {(Object.keys(role.permissions) as Array<keyof typeof role.permissions>).map((perm) => (
                                                                    <div key={perm} className="flex flex-col items-center gap-1.5">
                                                                        <Switch
                                                                            checked={role.permissions[perm]}
                                                                            onCheckedChange={() => togglePermission(role.id, perm)}
                                                                            className="scale-90 data-[state=checked]:bg-primary h-5 w-9"
                                                                        />
                                                                        <span className="text-[9px] uppercase font-bold text-muted-foreground/60">{perm.charAt(0)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-8 py-5 text-right">
                                                            <Badge
                                                                className={role.status === "Active"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold"
                                                                    : "bg-muted text-muted-foreground border-border font-bold"
                                                                }
                                                            >
                                                                {role.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                                        No roles matching your criteria were found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="glass-card border-none bg-primary/5 p-4 flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-primary/70">Total Roles</span>
                        <span className="text-2xl font-black text-primary">{roles.length}</span>
                    </Card>
                    <Card className="glass-card border-none bg-emerald-500/5 p-4 flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-emerald-600/70">Active Privileges</span>
                        <span className="text-2xl font-black text-emerald-600">{roles.filter(r => r.status === "Active").length}</span>
                    </Card>
                </div>

            </div>
        </AppLayout>
    )
}
