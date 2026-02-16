"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
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
  CalendarCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Clock,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

const sidebarItems = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: GraduationCap },
  { href: "/portal/admin/teachers", label: "Teachers", icon: Users },
  { href: "/portal/admin/classes", label: "Classes", icon: School },
  { href: "/portal/admin/periods", label: "Periods", icon: Clock },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/portal/admin/users", label: "User Management", icon: Settings },
  { href: "/portal/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
  { href: "/portal/admin/school-settings", label: "School Settings", icon: Settings },
]

const classSchema = z.object({
  name: z.string().min(2, { message: "Class name must be at least 2 characters." }),
  teacher: z.string().min(1, { message: "Please select a class teacher." }),
  room: z.string().min(1, { message: "Please enter room number." }),
  studentCount: z.coerce.number().min(0, { message: "Student count must be 0 or more." }),
})

type ClassFormValues = z.infer<typeof classSchema>

interface Period {
  id: string;
  classId: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
}

interface ClassRecord {
  id: string;
  _id?: string;
  name: string;
  teacher: string;
  room: string;
  studentCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      teacher: "",
      room: "",
      studentCount: 0,
    },
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [classesRes, periodsRes] = await Promise.all([
        fetch(`${API_URL}/classes`),
        fetch(`${API_URL}/periods`)
      ])

      if (!classesRes.ok || !periodsRes.ok) {
        throw new Error("Failed to fetch data from the server")
      }

      const [classesData, periodsData] = await Promise.all([
        classesRes.json(),
        periodsRes.json()
      ])

      setClasses(classesData)
      setPeriods(periodsData)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: "Could not load class data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (editingClass) {
      form.reset({
        name: editingClass.name,
        teacher: editingClass.teacher,
        room: editingClass.room,
        studentCount: editingClass.studentCount,
      })
    } else {
      form.reset({
        name: "",
        teacher: "",
        room: "",
        studentCount: 0,
      })
    }
  }, [editingClass, form])

  const onSubmit = async (data: ClassFormValues) => {
    setIsSubmitting(true)
    try {
      const classId = editingClass?.id || editingClass?._id
      const url = editingClass
        ? `${API_URL}/classes/${classId}`
        : `${API_URL}/classes`
      const method = editingClass ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error(`Failed to ${editingClass ? 'update' : 'create'} class`)

      toast({
        title: "Success",
        description: `Class ${editingClass ? 'updated' : 'created'} successfully.`,
      })

      setIsModalOpen(false)
      setEditingClass(null)
      fetchData()
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

  const handleDelete = async (classRecord: ClassRecord) => {
    const id = classRecord.id || classRecord._id
    if (!confirm(`Are you sure you want to delete ${classRecord.name}?`)) return

    try {
      const response = await fetch(`${API_URL}/classes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete class")

      toast({
        title: "Deleted",
        description: "Class has been successfully removed.",
      })
      fetchData()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (classRecord: ClassRecord) => {
    setEditingClass(classRecord)
    setIsModalOpen(true)
  }

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getClassPeriods = (classId: string) => {
    return periods.filter(p => p.classId === classId)
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Dr. Ahmad Raza" userRole="admin">
      <div className="flex flex-col gap-8 pb-8">

        <AnimatedWrapper direction="down">
          {/* Header Section */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="heading-1 text-burgundy-gradient">Classes Management</h1>
              <p className="text-sm text-muted-foreground">Monitor and organize school class sections and rosters.</p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
              setIsModalOpen(open)
              if (!open) setEditingClass(null)
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                  <Plus className="h-4 w-4" />
                  Add New Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
                <DialogHeader>
                  <DialogTitle className="heading-3">{editingClass ? 'Edit Class' : 'Create New Class'}</DialogTitle>
                  <DialogDescription>
                    {editingClass ? 'Update the class details below.' : 'Setup a new class section and assign a class teacher.'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Class Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Grade 10-A" {...field} className="glass-card" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teacher"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Class Teacher</FormLabel>
                            <FormControl>
                              <Input placeholder="Mr. Usman Sheikh" {...field} className="glass-card" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="room"
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
                        name="studentCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Students</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="glass-card" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 min-w-[120px]">
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingClass ? 'Update Class' : 'Create Class')}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </AnimatedWrapper>

        {/* Controls Section */}
        <AnimatedWrapper delay={0.1}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by class name or teacher..."
                className="h-11 pl-9 glass-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchData}
                className="h-11 w-11 glass-card"
                title="Refresh Data"
              >
                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="h-11 w-[140px] glass-card">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Classes Grid */}
        <AnimatedWrapper delay={0.2}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass-panel border-border/50 overflow-hidden h-[240px]">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-1/3 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <div className="space-y-2 pt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-center gap-4 glass-panel border-border/50">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Failed to load classes</h3>
                <p className="text-muted-foreground max-w-sm">{error}</p>
              </div>
              <Button onClick={fetchData} variant="outline" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((c) => {
                  const classPeriods = getClassPeriods(c.id || c._id || "");
                  return (
                    <Card key={c.id || c._id} className="glass-panel border-border/50 group transition-all duration-300 hover:shadow-burgundy-glow hover:border-primary/20 overflow-hidden flex flex-col">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className="mb-2 bg-primary/10 text-primary border-none text-[10px] font-bold">
                              Class
                            </Badge>
                            <CardTitle className="heading-3 truncate pr-4" title={c.name}>
                              {c.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1 font-medium text-primary/80 truncate">
                              {c.teacher}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary shrink-0">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-panel border-border/50">
                              <DropdownMenuItem onClick={() => handleEdit(c)} className="flex items-center gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary py-2 px-3">
                                <Edit size={14} />
                                Edit Class
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(c)} className="flex items-center gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive text-destructive py-2 px-3">
                                <Trash2 size={14} />
                                Delete Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 flex-1 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/5 text-primary">
                              <DoorOpen size={16} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Room</p>
                              <p className="text-xs font-bold">{c.room}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                              <Users2 size={16} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Students</p>
                              <p className="text-xs font-bold">{c.studentCount}</p>
                            </div>
                          </div>
                        </div>

                        {classPeriods.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
                              <Clock size={10} />
                              Today's Periods ({classPeriods.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {classPeriods.slice(0, 3).map((p, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-muted/50 text-[10px] h-5 py-0">
                                  {p.name}
                                </Badge>
                              ))}
                              {classPeriods.length > 3 && (
                                <span className="text-[10px] text-muted-foreground font-medium">+{classPeriods.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-auto">
                          <Button variant="outline" className="w-full text-xs h-9 border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors group">
                            View Full Details
                            <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground glass-panel border-border/50 border-dashed">
                  <p>No classes found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </AnimatedWrapper>

        {/* Pagination UI */}
        <AnimatedWrapper delay={0.3}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">1-{filteredClasses.length}</span> of <span className="font-semibold text-foreground">{classes.length}</span> classes
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-9 w-9 glass-card" disabled>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 bg-primary text-white hover:bg-primary/90 rounded-md">1</Button>
              <Button variant="outline" size="icon" className="h-9 w-9 glass-card">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </AppLayout>
  )
}
