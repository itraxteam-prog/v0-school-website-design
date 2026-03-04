"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Student {
    id: string;
    name: string;
    className: string;
}

interface AddParentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddParentDialog({ open, onOpenChange, onSuccess }: AddParentDialogProps) {
    const [parentName, setParentName] = useState("")
    const [parentEmail, setParentEmail] = useState("")
    const [password, setPassword] = useState("")
    const [autoGenerate, setAutoGenerate] = useState(true)
    const [linkedChildren, setLinkedChildren] = useState<Student[]>([])
    const [selectedStudentId, setSelectedStudentId] = useState("")
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (open) {
            const fetchStudents = async () => {
                setLoading(true)
                try {
                    const res = await fetch("/api/admin/students?limit=100")
                    if (res.ok) {
                        const data = await res.json()
                        setStudents(data.data)
                    }
                } catch (error) {
                    console.error("Failed to fetch students:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchStudents()
        }
    }, [open])

    const handleAddChild = (studentId: string) => {
        const student = students.find(s => s.id === studentId)
        if (student && !linkedChildren.find(c => c.id === studentId)) {
            setLinkedChildren((prev) => [...prev, student])
        }
        setSelectedStudentId("")
    }

    const handleRemoveChild = (childId: string) => {
        setLinkedChildren((prev) => prev.filter((c) => c.id !== childId))
    }

    const generatePassword = () => {
        return Math.random().toString(36).slice(-8)
    }

    const handleSubmit = async () => {
        if (!parentName || !parentEmail || (!autoGenerate && !password)) {
            toast.error("Please fill in all required fields")
            return
        }

        if (linkedChildren.length === 0) {
            toast.error("Please link at least one child")
            return
        }

        const finalPassword = autoGenerate ? generatePassword() : password

        setSubmitting(true)
        try {
            const res = await fetch("/api/admin/parents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: parentName,
                    email: parentEmail,
                    password: finalPassword,
                    studentIds: linkedChildren.map(c => c.id),
                })
            })

            if (res.ok) {
                toast.success("Parent account created successfully")
                onSuccess?.()
                onOpenChange(false)
                resetForm()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to create parent account")
            }
        } catch (error) {
            console.error("Submit error:", error)
            toast.error("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const resetForm = () => {
        setParentName("")
        setParentEmail("")
        setPassword("")
        setAutoGenerate(true)
        setLinkedChildren([])
        setSelectedStudentId("")
    }

    const availableStudents = students.filter((s) => !linkedChildren.find(c => c.id === s.id))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] glass-panel">
                <DialogHeader>
                    <DialogTitle className="heading-3">Add New Parent</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5 py-2">
                    {/* Parent Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="parent-name">Parent Name</Label>
                        <Input
                            id="parent-name"
                            placeholder="e.g. Muhammad Ali"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="bg-background"
                        />
                    </div>

                    {/* Parent Email */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="parent-email">Parent Email</Label>
                        <Input
                            id="parent-email"
                            type="email"
                            placeholder="e.g. parent@example.com"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="bg-background"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="parent-password">Password</Label>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="auto-generate-switch"
                                    checked={autoGenerate}
                                    onCheckedChange={setAutoGenerate}
                                />
                                <Label htmlFor="auto-generate-switch" className="text-xs text-muted-foreground cursor-pointer">
                                    Auto-generate
                                </Label>
                            </div>
                        </div>
                        <Input
                            id="parent-password"
                            type="password"
                            placeholder={autoGenerate ? "Will be auto-generated" : "Enter password"}
                            value={autoGenerate ? "" : password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={autoGenerate}
                            className="bg-background disabled:opacity-60"
                        />
                    </div>

                    {/* Link Children */}
                    <div className="flex flex-col gap-2">
                        <Label>Link Children</Label>
                        <Select
                            value={selectedStudentId}
                            onValueChange={(val) => {
                                handleAddChild(val)
                            }}
                            disabled={loading}
                        >
                            <SelectTrigger id="link-children-select" className="bg-background">
                                <SelectValue placeholder={loading ? "Loading students..." : "Select a student to link..."} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] overflow-y-auto">
                                {availableStudents.length > 0 ? (
                                    availableStudents.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name} ({s.className})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        {loading ? "Loading..." : "No students available"}
                                    </div>
                                )}
                            </SelectContent>
                        </Select>

                        {linkedChildren.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {linkedChildren.map((child) => (
                                    <Badge
                                        key={child.id}
                                        variant="outline"
                                        className="gap-1 border-primary/40 text-primary text-xs pr-1"
                                    >
                                        {child.name}
                                        <button
                                            onClick={() => handleRemoveChild(child.id)}
                                            className="ml-1 rounded-full hover:bg-primary/10 p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        id="submit-add-parent"
                        className="bg-primary text-white hover:bg-primary/90"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Parent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
