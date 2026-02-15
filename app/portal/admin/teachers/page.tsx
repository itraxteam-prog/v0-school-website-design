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
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus,
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

const teacherSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  employeeId: z.string().min(4, { message: "Employee ID must be at least 4 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Invalid phone number." }),
  subjects: z.string().min(1, { message: "Please enter subjects." }),
  classesManaged: z.string().min(1, { message: "Please enter classes managed." }),
  qualification: z.string().min(1, { message: "Please enter qualification." }),
  dateOfJoining: z.string().min(1, { message: "Please select date of joining." }),
  status: z.enum(["Active", "Inactive"]),
})

type TeacherFormValues = z.infer<typeof teacherSchema>

const dummyTeachers = [
  { empId: "T-2024-001", name: "Mr. Usman Sheikh", subjects: "Mathematics, Stats", classes: "10-A, 10-B", contact: "0321-4567890", status: "Active" },
  { empId: "T-2024-002", name: "Dr. Ayesha Siddiqui", subjects: "Physics", classes: "9-A, 10-A", contact: "0333-1234567", status: "Active" },
  { empId: "T-2024-003", name: "Ms. Nadia Jamil", subjects: "English Literature", classes: "8-A, 8-B, 9-A", contact: "0300-9876543", status: "Active" },
  { empId: "T-2024-004", name: "Mr. Bilal Ahmed", subjects: "Computer Science", classes: "10-B, 11-A", contact: "0345-5554433", status: "Active" },
  { empId: "T-2024-005", name: "Dr. Zainab Rizvi", subjects: "Chemistry", classes: "9-B, 10-B", contact: "0312-3332211", status: "Active" },
  { empId: "T-2024-006", name: "Ms. Hira Farooq", subjects: "Biology", classes: "9-A, 9-B", contact: "0322-1110099", status: "Active" },
  { empId: "T-2024-007", name: "Mr. Tariq Mehmood", subjects: "Urdu", classes: "8-A, 10-A", contact: "0301-4445566", status: "Inactive" },
]

export default function AdminTeachersPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: "",
      employeeId: "",
      email: "",
      phone: "",
      subjects: "",
      classesManaged: "",
      qualification: "",
      dateOfJoining: "",
      status: "Active",
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  function onSubmit(data: TeacherFormValues) {
    console.log(data)
    setIsModalOpen(false)
    form.reset()
  }

  const filteredTeachers = dummyTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.empId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="heading-1 text-burgundy-gradient">Teacher Management</h1>
            <p className="text-sm text-muted-foreground">Manage faculty records, assignments, and schedules.</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                <UserPlus className="h-4 w-4" />
                Add New Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glass-panel border-border/50 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="heading-3">Add Teacher</DialogTitle>
                <DialogDescription>
                  Enter official teacher details below to add them to the faculty list.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Sarah Johnson" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="T-2024-XXXX" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-card">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input type="email" placeholder="sarah.j@school.edu" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="03XXXXXXXXX" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjects</FormLabel>
                          <FormControl>
                            <Input placeholder="Math, Physics" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classesManaged"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classes Managed</FormLabel>
                          <FormControl>
                            <Input placeholder="10-A, 10-B" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="M.Phil, Ph.D." {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfJoining"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Joining</FormLabel>
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
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow">Add Teacher</Button>
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
              placeholder="Search by name or employee ID..."
              className="h-11 pl-9 glass-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[150px] glass-card">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[120px] glass-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Teachers Table */}
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
                      <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Emp ID</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Name</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Subjects</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider text-center">Classes</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Contact</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Status</TableHead>
                      <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.empId} className="border-border/50 transition-colors hover:bg-primary/5">
                          <TableCell className="pl-6 font-medium py-4">{teacher.empId}</TableCell>
                          <TableCell className="font-semibold text-foreground py-4">{teacher.name}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{teacher.subjects}</TableCell>
                          <TableCell className="py-4 text-center">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                              {teacher.classes}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-muted-foreground">{teacher.contact}</TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={teacher.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {teacher.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass-panel border-border/50">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50" />
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary">
                                  <Edit size={14} />
                                  Edit Record
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive text-destructive">
                                  <Trash2 size={14} />
                                  Terminate Contract
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No teachers found matching your search criteria.
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
            Showing <span className="font-semibold text-foreground">1-{filteredTeachers.length}</span> of <span className="font-semibold text-foreground">{dummyTeachers.length}</span> faculty members
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
      </div>
    </AppLayout>
  )
}
