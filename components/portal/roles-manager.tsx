"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
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
} from "@/components/ui/form"
import {
    AlertCircle,
    RefreshCcw,
    Plus,
    Search,
    ChevronUp,
    ChevronDown,
    Edit,
    Trash2,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AppLayout } from "@/components/layout/app-layout"
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const roleSchema = z.object({
    name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
    description: z.string().optional(),
    permissions: z.array(z.string()).min(1, { message: "Select at least one permission." }),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    userCount: number;
}

const availablePermissions = [
    "viewStudents", "editStudents", "deleteStudents",
    "viewTeachers", "editTeachers", "deleteTeachers",
    "viewClasses", "editClasses", "deleteClasses",
    "viewPeriods", "editPeriods", "deletePeriods",
    "viewRoles", "editRoles"
]

interface RolesManagerProps {
    initialRoles: Role[];
}

export function RolesManager({ initialRoles }: RolesManagerProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [roles, setRoles] = useState<Role[]>(initialRoles)
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
        },
    })

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc"
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })

        const sortedRoles = [...roles].sort((a: any, b: any) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1
            return 0
        })
        setRoles(sortedRoles)
    }

    const onSubmit = async (data: RoleFormValues) => {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            if (editingRole) {
                setRoles(prev => prev.map(r =>
                    (r.id === editingRole.id) ? { ...r, ...data } : r
                ));
            } else {
                const newRole: Role = {
                    id: `r-${Math.random().toString(36).substr(2, 4)}`,
                    name: data.name,
                    description: data.description,
                    permissions: data.permissions,
                    userCount: 0
                };
                setRoles(prev => [newRole, ...prev]);
            }

            toast({
                title: "Success",
                description: `Role ${editingRole ? 'updated' : 'added'} successfully.`,
            })

            setIsModalOpen(false)
            setEditingRole(null)
            form.reset()
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (role: Role) => {
        if (!confirm(`Are you sure you want to delete the "${role.name}" role?`)) return

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setRoles(prev => prev.filter(r => r.id !== role.id));
            toast({
                title: "Deleted",
                description: "Role has been removed successfully.",
            })
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        }
    }

    const handleEdit = (role: Role) => {
        setEditingRole(role)
        form.reset({
            name: role.name,
            description: role.description || "",
            permissions: role.permissions,
        })
        setIsModalOpen(true)
    }

    const filteredRoles = (roles || []).filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="heading-1 text-burgundy-gradient">Roles & Permissions</h1>
                        <p className="text-sm text-muted-foreground">Define and manage access control levels for the entire institution.</p>
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={(open) => {
                        setIsModalOpen(open)
                        if (!open) {
                            setEditingRole(null)
                            form.reset()
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow h-11 px-6 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add New Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl glass-panel border-border/50 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="heading-3">{editingRole ? "Edit Role" : "Define New Role"}</DialogTitle>
                                <DialogDescription>
                                    Configure granular access permissions for this role.
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

                                    <div className="space-y-3">
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Permissions</FormLabel>
                                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {availablePermissions.map((perm) => (
                                                <FormField
                                                    key={perm}
                                                    control={form.control}
                                                    name="permissions"
                                                    render={({ field }) => {
                                                        const isChecked = field.value?.includes(perm);
                                                        return (
                                                            <div className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-3 bg-muted/5 shadow-sm">
                                                                <span className="text-xs font-medium capitalize">{perm.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                                <FormControl>
                                                                    <Switch
                                                                        checked={isChecked}
                                                                        onCheckedChange={(checked) => {
                                                                            const newValue = checked
                                                                                ? [...(field.value || []), perm]
                                                                                : field.value?.filter((val) => val !== perm);
                                                                            field.onChange(newValue);
                                                                        }}
                                                                        className="data-[state=checked]:bg-primary h-5 w-9 scale-90"
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </div>

                                    <DialogFooter className="pt-2">
                                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow px-8">
                                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingRole ? 'Update Role' : 'Define Role')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search roles or descriptions..."
                            className="h-11 pl-9 glass-card shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchRoles} className="h-11 w-11 glass-card">
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                <Card className="glass-panel border-border/50 overflow-hidden shadow-xl">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                <Skeleton className="h-10 w-full" />
                                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                            </div>
                        ) : error ? (
                            <div className="p-12 flex flex-col items-center gap-4 text-center">
                                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive"><AlertCircle size={24} /></div>
                                <h3 className="font-semibold text-lg">Failed to load data</h3>
                                <Button onClick={fetchRoles} variant="outline" className="gap-2"><RefreshCcw className="h-4 w-4" /> Try Again</Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead className="pl-8 py-4 cursor-pointer group" onClick={() => handleSort("name")}>Role Name</TableHead>
                                            <TableHead className="py-4">Assigned Permissions</TableHead>
                                            <TableHead className="py-4 text-center cursor-pointer group" onClick={() => handleSort("userCount")}>Users Count</TableHead>
                                            <TableHead className="pr-8 py-4 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="popLayout">
                                            {filteredRoles.length > 0 ? (
                                                filteredRoles.map((role) => (
                                                    <motion.tr
                                                        key={role.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="border-border/40 hover:bg-primary/5 transition-colors group"
                                                    >
                                                        <TableCell className="pl-8 py-5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-bold text-foreground capitalize">{role.name}</span>
                                                                <span className="text-[10px] text-muted-foreground italic">{role.description}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-5">
                                                            <div className="flex flex-wrap gap-1 max-w-md">
                                                                {role.permissions.slice(0, 5).map((perm, idx) => (
                                                                    <Badge key={idx} variant="secondary" className="text-[9px] font-bold bg-muted/50 h-5">{perm.replace(/([A-Z])/g, ' $1').trim()}</Badge>
                                                                ))}
                                                                {role.permissions.length > 5 && <Badge variant="outline" className="text-[9px] font-bold h-5">+{role.permissions.length - 5} more</Badge>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-5 text-center">
                                                            <span className="bg-primary/5 text-primary px-3 py-1 rounded text-xs font-black">{role.userCount}</span>
                                                        </TableCell>
                                                        <TableCell className="pr-8 py-5 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(role)} className="h-8 w-8 text-muted-foreground hover:text-primary"><Edit size={16} /></Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(role)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></Button>
                                                            </div>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No roles found.</TableCell></TableRow>
                                            )}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="glass-card border-none bg-primary/5 p-4 flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-primary/70">Total Defined Roles</span>
                        <span className="text-2xl font-black text-primary">{roles.length}</span>
                    </Card>
                    <Card className="glass-card border-none bg-emerald-500/5 p-4 flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-emerald-600/70">System Permissions</span>
                        <span className="text-2xl font-black text-emerald-600">{availablePermissions.length}</span>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
