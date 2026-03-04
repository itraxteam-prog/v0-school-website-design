"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react"
import { ADMIN_SIDEBAR } from "@/lib/navigation-config"
import { AddParentDialog } from "@/components/portal/admin/add-parent-dialog"
import { toast } from "sonner"

interface Parent {
    id: string;
    name: string;
    email: string;
    status: string;
    children: {
        id: string;
        name: string;
        class: string;
        rollNumber: string;
    }[];
}

export default function AdminParentsPage() {
    const [parents, setParents] = useState<Parent[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const fetchParents = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/parents")
            if (res.ok) {
                const data = await res.json()
                setParents(data)
            }
        } catch (error) {
            console.error("Failed to fetch parents:", error)
            toast.error("Failed to load parents")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchParents()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this parent account? This will also remove the link to their children.")) return

        setIsDeleting(id)
        try {
            const res = await fetch(`/api/admin/parents/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                toast.success("Parent account deleted")
                setParents(prev => prev.filter(p => p.id !== id))
            } else {
                toast.error("Failed to delete parent account")
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("An error occurred while deleting")
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <AppLayout sidebarItems={ADMIN_SIDEBAR} userName="Admin" userRole="Admin">
            <div className="flex flex-col gap-8 pb-8">
                {/* Header */}
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="heading-1 text-burgundy-gradient">Manage Parents</h1>
                            <p className="text-sm text-muted-foreground">
                                View, add, and manage parent accounts linked to students.
                            </p>
                        </div>
                        <Button
                            id="add-parent-btn"
                            className="gap-2 bg-primary text-white hover:bg-primary/90 w-fit"
                            onClick={() => setDialogOpen(true)}
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Parent
                        </Button>
                    </div>
                </AnimatedWrapper>

                {/* Parents Table */}
                <AnimatedWrapper delay={0.15}>
                    <Card className="glass-panel overflow-hidden border-border/50">
                        <CardHeader>
                            <CardTitle className="heading-3 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                All Parents
                                {!loading && (
                                    <Badge variant="secondary" className="ml-2 text-xs font-bold">
                                        {parents.length} registered
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Linked Children</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {parents.length > 0 ? (
                                                parents.map((parent) => (
                                                    <TableRow
                                                        key={parent.id}
                                                        className="group border-border/50 transition-colors hover:bg-primary/5"
                                                    >
                                                        <TableCell className="font-medium">{parent.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">{parent.email}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                {parent.children.map((child) => (
                                                                    <Badge
                                                                        key={child.id}
                                                                        variant="outline"
                                                                        className="text-[10px] border-primary/30 text-primary py-0"
                                                                    >
                                                                        {child.name} ({child.class})
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={parent.status === "ACTIVE" ? "default" : "secondary"}
                                                                className={`text-[10px] font-semibold uppercase ${parent.status === "ACTIVE"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                {parent.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    id={`delete-parent-${parent.id}`}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    disabled={isDeleting === parent.id}
                                                                    onClick={() => handleDelete(parent.id)}
                                                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                                >
                                                                    {isDeleting === parent.id ? (
                                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    )}
                                                                    <span className="sr-only">Delete</span>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                        No parent accounts found.
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
            </div>

            <AddParentDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={fetchParents}
            />
        </AppLayout>
    )
}
