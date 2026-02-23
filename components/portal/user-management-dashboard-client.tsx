"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    UserPlus,
    ShieldAlert,
    Key,
    ChevronLeft,
    ChevronRight,
    Filter,
    UserCheck,
    UserX,
    RefreshCcw,
    AlertCircle,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config"

const userSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    status: z.enum(["ACTIVE", "SUSPENDED"]),
})

type UserFormValues = z.infer<typeof userSchema>

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    status: "ACTIVE" | "SUSPENDED";
    createdAt?: string;
}

export function UserManagementDashboardClient({ user: currentUser }: { user: any }) {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            email: "",
            role: "STUDENT",
            password: "",
            status: "ACTIVE",
        },
    })

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/admin/users")
            if (!response.ok) throw new Error("Failed to fetch users")
            const data = await response.json()
            setUsers(data)
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
            toast.error("Could not load users. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    async function onSubmit(data: UserFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.fullName,
                    email: data.email,
                    role: data.role,
                    password: data.password,
                }),
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.error || "Failed to create user")
            }

            toast.success("User added successfully")
            setIsAddModalOpen(false)
            form.reset()
            fetchUsers()
        } catch (err: any) {
            console.error("Submit Error:", err);
            toast.error(err.message || "Failed to add user")
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        if (!selectedUser) return

        try {
            const response = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete user")

            toast.success("User deleted successfully")
            setIsDeleteModalOpen(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user")
        }
    }

    const handleStatusToggle = async (user: User) => {
        // Current requirement is hardening, status update API not yet present in snippets.
        // Ideally we would have an API for this.
        toast.info("Status updates are restricted via management console for safety.")
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesStatus = statusFilter === "all" || u.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    })

    return (
        <AppLayout sidebarItems={sidebarItems} userName={currentUser?.name || "Admin"} userRole="admin">
            <div className="flex flex-col gap-8 pb-8">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="heading-1 text-burgundy-gradient">User Management</h1>
                            <p className="text-sm text-muted-foreground">Configure system access, roles, and security policies.</p>
                        </div>

                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                    <UserPlus className="h-4 w-4" />
                                    Add New User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="heading-3">Create Account</DialogTitle>
                                    <DialogDescription>
                                        Setup a new user account and assign appropriate permissions.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Jonathan Doe" {...field} className="glass-card" />
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
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="j.doe@school.edu" {...field} className="glass-card" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Role</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="glass-card">
                                                                    <SelectValue placeholder="Select role" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                                <SelectItem value="TEACHER">Teacher</SelectItem>
                                                                <SelectItem value="STUDENT">Student</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Initial Status</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="glass-card">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} className="glass-card" />
                                                    </FormControl>
                                                    <p className="text-[10px] text-muted-foreground mt-1 px-1">
                                                        Min 8 characters, with uppercase, lowercase, number, and special character.
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow min-w-[120px]">
                                                {isSubmitting ? (
                                                    <>
                                                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    'Create User'
                                                )}
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
                                placeholder="Search by name or email..."
                                className="h-11 pl-9 glass-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchUsers}
                                className="h-11 w-11 glass-card"
                                title="Refresh Data"
                            >
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="h-11 w-[130px] glass-card">
                                    <SelectValue placeholder="Filter Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="TEACHER">Teacher</SelectItem>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-11 w-[130px] glass-card">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
                                <Filter className="h-4 w-4" />
                                More Filters
                            </Button>
                        </div>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.2}>
                    <Card className="glass-panel border-border/50 overflow-hidden">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-10 w-full rounded-md" />
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">Failed to load data</h3>
                                        <p className="text-muted-foreground text-sm">{error}</p>
                                    </div>
                                    <Button onClick={fetchUsers} variant="outline" className="gap-2">
                                        <RefreshCcw className="h-4 w-4" />
                                        Try Again
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-border/50 hover:bg-transparent">
                                                <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Name</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Email</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Role</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Status</TableHead>
                                                <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Created At</TableHead>
                                                <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <TableRow key={user.id} className="border-border/50 transition-colors hover:bg-primary/5 group">
                                                        <TableCell className="pl-6 py-4 font-semibold text-foreground truncate max-w-[150px]" title={user.name}>{user.name || "N/A"}</TableCell>
                                                        <TableCell className="py-4 text-muted-foreground truncate max-w-[200px]" title={user.email}>{user.email}</TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    user.role === "ADMIN" ? "border-primary/20 text-primary bg-primary/5" :
                                                                        user.role === "TEACHER" ? "border-blue-200 text-blue-700 bg-blue-50" :
                                                                            "border-emerald-200 text-emerald-700 bg-emerald-50"
                                                                }
                                                            >
                                                                {user.role}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-muted-foreground">
                                                            <Badge
                                                                variant="outline"
                                                                className={user.status === "ACTIVE"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                                }
                                                            >
                                                                {user.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-xs font-medium text-muted-foreground uppercase">
                                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right py-4">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                                        <MoreVertical size={16} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="glass-panel border-border/50">
                                                                    <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="bg-border/50" />
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 py-2"
                                                                        onClick={() => handleStatusToggle(user)}
                                                                    >
                                                                        {user.status === "ACTIVE" ? <UserX size={14} className="text-amber-600" /> : <UserCheck size={14} className="text-emerald-600" />}
                                                                        {user.status === "ACTIVE" ? "Suspend Access" : "Activate User"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 py-2"
                                                                        onClick={() => toast.success("Password reset link sent to email")}
                                                                    >
                                                                        <Key size={14} />
                                                                        Reset Password
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-border/50" />
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive text-destructive py-2"
                                                                        onClick={() => {
                                                                            setSelectedUser(user);
                                                                            setIsDeleteModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        Delete User
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                                        No users matching your criteria were found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </AnimatedWrapper>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">1-{filteredUsers.length}</span> of <span className="font-semibold text-foreground">{users.length}</span> users
                    </p>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-9 w-9 glass-card" disabled>
                            <ChevronLeft size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 bg-primary text-white hover:bg-primary/90">1</Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 glass-card">
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>

                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-[400px] glass-panel border-border/50">
                        <DialogHeader className="flex flex-col items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                <ShieldAlert className="h-6 w-6 text-destructive" />
                            </div>
                            <DialogTitle className="heading-3 text-center">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-center">
                                Are you sure you want to delete <span className="font-bold text-foreground">{selectedUser?.name || selectedUser?.email}</span>? This action is permanent.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="grid grid-cols-2 gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button
                                variant="destructive"
                                className="shadow-lg shadow-destructive/20"
                                onClick={confirmDelete}
                            >
                                Delete User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
