"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Users, PlusCircle, Pencil, Trash2 } from "lucide-react"
import { ADMIN_SIDEBAR } from "@/lib/navigation-config"
import { AddParentDialog } from "@/components/portal/admin/add-parent-dialog"

const MOCK_PARENTS = [
    {
        id: "1",
        name: "Muhammad Ali",
        email: "m.ali@example.com",
        linkedChildren: ["Ahmed Ali", "Sara Ali"],
        status: "Active",
    },
    {
        id: "2",
        name: "Fatima Zahra",
        email: "fatima.zahra@example.com",
        linkedChildren: ["Omar Zahra"],
        status: "Active",
    },
    {
        id: "3",
        name: "Khalid Hassan",
        email: "k.hassan@example.com",
        linkedChildren: ["Aisha Hassan"],
        status: "Inactive",
    },
    {
        id: "4",
        name: "Sana Mahmood",
        email: "sana.m@example.com",
        linkedChildren: ["Bilal Mahmood", "Zara Mahmood"],
        status: "Active",
    },
]

export default function AdminParentsPage() {
    const [dialogOpen, setDialogOpen] = useState(false)

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
                                <Badge variant="secondary" className="ml-2 text-xs font-bold">
                                    {MOCK_PARENTS.length} registered
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
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
                                        {MOCK_PARENTS.map((parent) => (
                                            <TableRow
                                                key={parent.id}
                                                className="group border-border/50 transition-colors hover:bg-primary/5"
                                            >
                                                <TableCell className="font-medium">{parent.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{parent.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {parent.linkedChildren.map((child) => (
                                                            <Badge
                                                                key={child}
                                                                variant="outline"
                                                                className="text-xs border-primary/30 text-primary"
                                                            >
                                                                {child}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={parent.status === "Active" ? "default" : "secondary"}
                                                        className={`text-xs font-semibold ${parent.status === "Active"
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
                                                            id={`edit-parent-${parent.id}`}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button
                                                            id={`delete-parent-${parent.id}`}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>

            <AddParentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </AppLayout>
    )
}
