"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
  Plus,
  Users2,
  DoorOpen,
  Trophy,
  CalendarCheck,
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
]

const classSchema = z.object({
  className: z.string().min(2, { message: "Class name must be at least 2 characters." }),
  section: z.string().min(1, { message: "Please enter section." }),
  classTeacher: z.string().min(1, { message: "Please select a class teacher." }),
  roomNumber: z.string().min(1, { message: "Please enter room number." }),
  capacity: z.string().min(1, { message: "Please enter capacity." }),
  status: z.enum(["Active", "Inactive"]),
})

type ClassFormValues = z.infer<typeof classSchema>

const dummyClasses = [
  { id: 1, name: "Grade 10", section: "A", teacher: "Mr. Usman Sheikh", room: "Room 201", strength: 32, avgGrade: "A", attendance: "94%", status: "Active" },
  { id: 2, name: "Grade 10", section: "B", teacher: "Dr. Ayesha Siddiqui", room: "Room 202", strength: 30, avgGrade: "A-", attendance: "92%", status: "Active" },
  { id: 3, name: "Grade 9", section: "A", teacher: "Ms. Nadia Jamil", room: "Room 301", strength: 35, avgGrade: "B+", attendance: "96%", status: "Active" },
  { id: 4, name: "Grade 9", section: "B", teacher: "Mr. Bilal Ahmed", room: "Room 302", strength: 33, avgGrade: "B", attendance: "88%", status: "Active" },
  { id: 5, name: "Grade 8", section: "A", teacher: "Dr. Zainab Rizvi", room: "Room 101", strength: 28, avgGrade: "A", attendance: "95%", status: "Active" },
  { id: 6, name: "Grade 8", section: "B", teacher: "Ms. Hira Farooq", room: "Room 102", strength: 30, avgGrade: "B+", attendance: "91%", status: "Active" },
]

const stats = [
  { label: "Total Classes", value: "24", icon: School, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Avg Class Size", value: "31", icon: Users2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Overall Attendance", value: "93.4%", icon: CalendarCheck, color: "text-amber-600", bg: "bg-amber-50" },
]

export default function AdminClassesPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      className: "",
      section: "",
      classTeacher: "",
      roomNumber: "",
      capacity: "",
      status: "Active",
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  function onSubmit(data: ClassFormValues) {
    console.log(data)
    setIsModalOpen(false)
    form.reset()
  }

  const filteredClasses = dummyClasses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="heading-1 text-burgundy-gradient">Classes Management</h1>
            <p className="text-sm text-muted-foreground">Monitor and organize school class sections and rosters.</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                <Plus className="h-4 w-4" />
                Add New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
              <DialogHeader>
                <DialogTitle className="heading-3">Create New Class</DialogTitle>
                <DialogDescription>
                  Setup a new class section and assign a class teacher.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="className"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Grade 10" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <FormControl>
                            <Input placeholder="A" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classTeacher"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Class Teacher</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-card">
                                <SelectValue placeholder="Select teacher" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mr. Usman Sheikh">Mr. Usman Sheikh</SelectItem>
                              <SelectItem value="Dr. Ayesha Siddiqui">Dr. Ayesha Siddiqui</SelectItem>
                              <SelectItem value="Ms. Nadia Jamil">Ms. Nadia Jamil</SelectItem>
                              <SelectItem value="Mr. Bilal Ahmed">Mr. Bilal Ahmed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Room 201" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="40" {...field} className="glass-card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
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
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90">Create Class</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="glass-panel border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by class name..."
              className="h-11 pl-9 glass-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[140px] glass-card">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Classes Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass-panel border-border/50 overflow-hidden h-[240px]">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-1/3 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <Skeleton className="h-10 w-full rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((c) => (
                  <Card key={c.id} className="glass-panel border-border/50 group transition-all duration-300 hover:shadow-burgundy-glow hover:border-primary/20 overflow-hidden">
                    <CardHeader className="p-5 pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2 bg-primary/10 text-primary border-none text-[10px] font-bold">
                            {c.name}
                          </Badge>
                          <CardTitle className="heading-3 flex items-center gap-2">
                            Section {c.section}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 font-medium text-primary/80">
                            {c.teacher}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-panel border-border/50">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary py-2 px-3">
                              <Edit size={14} />
                              Edit Class
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive text-destructive py-2 px-3">
                              <Trash2 size={14} />
                              Delete Class
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="grid grid-cols-2 gap-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-muted/50">
                            <DoorOpen size={14} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Room</p>
                            <p className="text-xs font-medium">{c.room}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-muted/50">
                            <Users2 size={14} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Strength</p>
                            <p className="text-xs font-medium">{c.strength} Students</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-muted/50">
                            <Trophy size={14} className="text-primary/70" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Avg Grade</p>
                            <p className="text-xs font-bold text-primary">{c.avgGrade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-muted/50">
                            <CalendarCheck size={14} className="text-emerald-600/70" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Attendance</p>
                            <p className="text-xs font-bold text-emerald-600">{c.attendance}</p>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full text-xs h-9 border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                        View Full Roster
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground glass-panel border-border/50 border-dashed">
                  <p>No classes found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
