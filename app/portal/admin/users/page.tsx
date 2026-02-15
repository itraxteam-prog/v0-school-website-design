"use client"

import { useState, useEffect } from "react"
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
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BarChart3,
  FileBarChart,
  Settings,
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
  ShieldCheck,
} from "lucide-react"
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

const userSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(["Admin", "Teacher", "Student"]),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  status: z.enum(["Active", "Suspended"]),
})

type UserFormValues = z.infer<typeof userSchema>

const dummyUsers = [
  { id: 1, name: "Dr. Ahmad Raza", email: "ahmad.raza@pioneershigh.edu", role: "Admin", status: "Active", lastLogin: "2026-02-15 08:30" },
  { id: 2, name: "Mr. Usman Sheikh", email: "usman.sheikh@pioneershigh.edu", role: "Teacher", status: "Active", lastLogin: "2026-02-15 09:15" },
  { id: 3, name: "Dr. Ayesha Siddiqui", email: "ayesha.siddiqui@pioneershigh.edu", role: "Teacher", status: "Active", lastLogin: "2026-02-14 14:20" },
  { id: 4, name: "Ahmed Khan", email: "ahmed.khan@pioneershigh.edu", role: "Student", status: "Active", lastLogin: "2026-02-15 10:05" },
  { id: 5, name: "Sara Ali", email: "sara.ali@pioneershigh.edu", role: "Student", status: "Active", lastLogin: "2026-02-15 11:45" },
  { id: 6, name: "Omar Farooq", email: "omar.farooq@pioneershigh.edu", role: "Student", status: "Suspended", lastLogin: "2026-02-10 16:50" },
  { id: 7, name: "Ms. Nadia Jamil", email: "nadia.jamil@pioneershigh.edu", role: "Teacher", status: "Active", lastLogin: "2026-02-15 08:00" },
  { id: 8, name: "Mr. Tariq Mehmood", email: "tariq.mehmood@pioneershigh.edu", role: "Teacher", status: "Suspended", lastLogin: "2026-01-28 12:30" },
]

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<typeof dummyUsers[0] | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "Student",
      password: "",
      status: "Active",
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  function onSubmit(data: UserFormValues) {
    console.log(data)
    setIsAddModalOpen(false)
    form.reset()
  }

  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (user: typeof dummyUsers[0]) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
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
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Teacher">Teacher</SelectItem>
                              <SelectItem value="Student">Student</SelectItem>
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
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Suspended">Suspended</SelectItem>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow">Create User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Controls Section */}
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
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[130px] glass-card">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[130px] glass-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="glass-panel border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-10 w-full rounded-md" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
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
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Last Login</TableHead>
                      <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-border/50 transition-colors hover:bg-primary/5 group">
                          <TableCell className="pl-6 py-4 font-semibold text-foreground">{user.name}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{user.email}</TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={
                                user.role === "Admin" ? "border-primary/20 text-primary bg-primary/5" :
                                  user.role === "Teacher" ? "border-blue-200 text-blue-700 bg-blue-50" :
                                    "border-emerald-200 text-emerald-700 bg-emerald-50"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-muted-foreground">
                            <Badge
                              className={user.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-xs font-medium text-muted-foreground uppercase">{user.lastLogin}</TableCell>
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
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary py-2">
                                  <Edit size={14} />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 py-2">
                                  {user.status === "Active" ? <UserX size={14} className="text-amber-600" /> : <UserCheck size={14} className="text-emerald-600" />}
                                  {user.status === "Active" ? "Suspend Access" : "Activate User"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 py-2">
                                  <Key size={14} />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border/50" />
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive text-destructive py-2"
                                  onClick={() => handleDelete(user)}
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
                          No users matching "{searchTerm}" were found in the directory.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination UI */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">1-{filteredUsers.length}</span> of <span className="font-semibold text-foreground">{dummyUsers.length}</span> registered users
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 glass-card" disabled>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 bg-primary text-white hover:bg-primary/90">1</Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-primary/5">2</Button>
            <Button variant="outline" size="icon" className="h-9 w-9 glass-card">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] glass-panel border-border/50">
            <DialogHeader className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle className="heading-3 text-center">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-center">
                Are you sure you want to delete <span className="font-bold text-foreground">{selectedUser?.name}</span>? This action is permanent and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" className="shadow-lg shadow-destructive/20" onClick={() => setIsDeleteModalOpen(false)}>Delete User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  )
}
