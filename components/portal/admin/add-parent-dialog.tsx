"use client"

import { useState } from "react"
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
import { X } from "lucide-react"

const MOCK_STUDENTS = [
    "Ahmed Ali",
    "Sara Ali",
    "Omar Zahra",
    "Aisha Hassan",
    "Bilal Mahmood",
    "Zara Mahmood",
    "Hina Qureshi",
    "Tariq Raza",
]

interface AddParentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddParentDialog({ open, onOpenChange }: AddParentDialogProps) {
    const [parentName, setParentName] = useState("")
    const [parentEmail, setParentEmail] = useState("")
    const [password, setPassword] = useState("")
    const [autoGenerate, setAutoGenerate] = useState(false)
    const [linkedChildren, setLinkedChildren] = useState<string[]>([])
    const [selectedStudent, setSelectedStudent] = useState("")

    const handleAddChild = (student: string) => {
        if (student && !linkedChildren.includes(student)) {
            setLinkedChildren((prev) => [...prev, student])
        }
        setSelectedStudent("")
    }

    const handleRemoveChild = (child: string) => {
        setLinkedChildren((prev) => prev.filter((c) => c !== child))
    }

    const handleSubmit = () => {
        // No action yet — just closes modal as per plan
        onOpenChange(false)
        setParentName("")
        setParentEmail("")
        setPassword("")
        setAutoGenerate(false)
        setLinkedChildren([])
    }

    const availableStudents = MOCK_STUDENTS.filter((s) => !linkedChildren.includes(s))

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
                            value={selectedStudent}
                            onValueChange={(val) => {
                                handleAddChild(val)
                            }}
                        >
                            <SelectTrigger id="link-children-select" className="bg-background">
                                <SelectValue placeholder="Select a student to link..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableStudents.length > 0 ? (
                                    availableStudents.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        All students linked
                                    </div>
                                )}
                            </SelectContent>
                        </Select>

                        {linkedChildren.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {linkedChildren.map((child) => (
                                    <Badge
                                        key={child}
                                        variant="outline"
                                        className="gap-1 border-primary/40 text-primary text-xs pr-1"
                                    >
                                        {child}
                                        <button
                                            onClick={() => handleRemoveChild(child)}
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        id="submit-add-parent"
                        className="bg-primary text-white hover:bg-primary/90"
                        onClick={handleSubmit}
                    >
                        Add Parent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
