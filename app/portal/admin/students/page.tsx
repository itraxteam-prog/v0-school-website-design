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

const studentSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rollNumber: z.string().min(4, { message: "Roll number must be at least 4 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  gender: z.string().min(1, { message: "Please select gender." }),
  dob: z.string().min(1, { message: "Please select date of birth." }),
  parentContact: z.string().min(10, { message: "Invalid contact number." }),
  status: z.enum(["Active", "Inactive"]),
})

type StudentFormValues = z.infer<typeof studentSchema>

const dummyStudents = [
  { rollNo: "2025-0142", name: "Ahmed Khan", class: "10-A", gender: "Male", attendance: "94%", grade: "A", status: "Active" },
  { rollNo: "2025-0143", name: "Sara Ali", class: "10-A", gender: "Female", attendance: "98%", grade: "A+", status: "Active" },
  { rollNo: "2025-0144", name: "Hamza Butt", class: "10-A", gender: "Male", attendance: "89%", grade: "B+", status: "Active" },
  { rollNo: "2025-0145", name: "Fatima Noor", class: "10-B", gender: "Female", attendance: "92%", grade: "A", status: "Active" },
  { rollNo: "2025-0146", name: "Bilal Shah", class: "10-B", gender: "Male", attendance: "85%", grade: "B", status: "Active" },
  { rollNo: "2025-0201", name: "Zain Malik", class: "9-A", gender: "Male", attendance: "96%", grade: "A", status: "Active" },
  { rollNo: "2025-0202", name: "Aisha Rehman", class: "9-A", gender: "Female", attendance: "99%", grade: "A+", status: "Active" },
  { rollNo: "2025-0203", name: "Omar Farooq", class: "9-B", gender: "Male", attendance: "78%", grade: "C", status: "Inactive" },
  { rollNo: "2025-0204", name: "Hira Jamil", class: "9-B", gender: "Female", attendance: "91%", grade: "A", status: "Active" },
  { rollNo: "2025-0301", name: "Ali Raza", class: "8-A", gender: "Male", attendance: "93%", grade: "B+", status: "Active" },
]

export default function AdminStudentsPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      rollNumber: "",
      class: "",
      gender: "",
      dob: "",
      parentContact: "",
      status: "Active",
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  function onSubmit(data: StudentFormValues) {
    console.log(data)
    setIsModalOpen(false)
    form.reset()
  }

  const filteredStudents = dummyStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="heading-1 text-burgundy-gradient">Student Management</h1>
            <p className="text-sm text-muted-foreground">Monitor enrollment, academics, and attendance.</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                <UserPlus className="h-4 w-4" />
                Add New Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
              <DialogHeader>
                <DialogTitle className="heading-3">Add Student</DialogTitle>
                <DialogDescription>
                  Enter the student details below to register them in the system.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rollNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number</FormLabel>
                          <FormControl>
                            <Input placeholder="2025-XXXX" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-card">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10-A">10-A</SelectItem>
                              <SelectItem value="10-B">10-B</SelectItem>
                              <SelectItem value="9-A">9-A</SelectItem>
                              <SelectItem value="9-B">9-B</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-card">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="+92 XXX XXXXXXX" {...field} className="glass-card" />
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
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow">Save Student</Button>
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
              placeholder="Search by name or roll number..."
              className="h-11 pl-9 glass-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[140px] glass-card">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="10-A">10-A</SelectItem>
                <SelectItem value="10-B">10-B</SelectItem>
                <SelectItem value="9-A">9-A</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Students Table */}
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
                      <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider">Roll No</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Name</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Class</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Gender</TableHead>
                      <TableHead className="text-center font-semibold h-12 uppercase text-[10px] tracking-wider">Attendance</TableHead>
                      <TableHead className="text-center font-semibold h-12 uppercase text-[10px] tracking-wider">Avg Grade</TableHead>
                      <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Status</TableHead>
                      <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.rollNo} className="border-border/50 transition-colors hover:bg-primary/5">
                          <TableCell className="pl-6 font-medium py-4">{student.rollNo}</TableCell>
                          <TableCell className="font-semibold text-foreground py-4">{student.name}</TableCell>
                          <TableCell className="py-4">{student.class}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{student.gender}</TableCell>
                          <TableCell className="text-center py-4">
                            <span className="font-medium">{student.attendance}</span>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                              {student.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={student.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {student.status}
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
                                  Edit Student
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive text-destructive">
                                  <Trash2 size={14} />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                          No students found matching your search criteria.
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
            Showing <span className="font-semibold text-foreground">1-{filteredStudents.length}</span> of <span className="font-semibold text-foreground">{dummyStudents.length}</span> students
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 glass-card" disabled>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 bg-primary text-white hover:bg-primary/90">1</Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-primary/5">2</Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-primary/5 hidden sm:flex">3</Button>
            <Button variant="outline" size="icon" className="h-9 w-9 glass-card">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
