"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, UserPlus, RefreshCcw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { useStudentOperations } from "./students/use-student-operations";
import { StudentTable } from "./students/student-table";
import { StudentForm } from "./students/student-form";
import { Student, StudentFormValues } from "./students/student-schema";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface StudentsManagerProps {
    initialStudents: any[];
}

export function StudentsManager({ initialStudents }: StudentsManagerProps) {
    const router = useRouter();
    const { toast } = useToast();
    const {
        students,
        classes,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        page,
        setPage,
        totalPages,
        totalStudents,
        fetchStudents,
        deleteStudent
    } = useStudentOperations(1, "");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: StudentFormValues, selectedFile: File | null) => {
        setIsSubmitting(true);
        try {
            let finalImageUrl = data.imageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalImageUrl = uploadData.url;
                } else {
                    const errData = await uploadRes.json().catch(() => ({}));
                    throw new Error(errData.error || "Image upload failed.");
                }
            }

            const url = editingStudent ? `/api/admin/students/${editingStudent.id}` : "/api/admin/students";
            const method = editingStudent ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, imageUrl: finalImageUrl })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Operation failed");
            }

            toast({ title: "Success", description: `Student ${editingStudent ? 'updated' : 'added'} successfully.` });
            
            if (!editingStudent) setPage(1);
            router.refresh();
            fetchStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-8">
            <AnimatedWrapper direction="down">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="heading-1 text-burgundy-gradient">Student Management</h1>
                        <p className="text-sm text-muted-foreground">Monitor enrollment, academics, and student records.</p>
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={(open) => {
                        setIsModalOpen(open);
                        if (!open) setEditingStudent(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 h-11 px-6 shadow-burgundy-glow">
                                <UserPlus className="h-4 w-4" />
                                Add New Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] glass-panel border-border/50 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="heading-3">{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
                                <DialogDescription>
                                    {editingStudent ? 'Update the student details below.' : 'Enter the student details below to register them in the system.'}
                                </DialogDescription>
                            </DialogHeader>
                            <StudentForm 
                                editingStudent={editingStudent} 
                                onSubmit={handleFormSubmit} 
                                isSubmitting={isSubmitting} 
                                onCancel={() => setIsModalOpen(false)} 
                                classes={classes}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </AnimatedWrapper>

            <AnimatedWrapper delay={0.1}>
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
                        <Button variant="outline" size="icon" onClick={() => fetchStudents()} className="h-11 w-11 glass-card">
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="outline" className="h-11 flex items-center gap-2 glass-card">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>
            </AnimatedWrapper>

            <AnimatedWrapper delay={0.2}>
                <Card className="glass-panel border-border/50 overflow-hidden shadow-xl">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                            </div>
                        ) : error ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                                <AlertCircle className="h-12 w-12 text-destructive" />
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">Failed to load data</h3>
                                    <p className="text-muted-foreground">{error}</p>
                                </div>
                                <Button onClick={() => fetchStudents()} variant="outline">Try Again</Button>
                            </div>
                        ) : (
                            <StudentTable 
                                students={students} 
                                onEdit={(s) => { setEditingStudent(s); setIsModalOpen(true); }} 
                                onDelete={(s) => deleteStudent(s.id, s.name)} 
                            />
                        )}
                    </CardContent>
                </Card>
            </AnimatedWrapper>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{totalStudents > 0 ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, totalStudents)}</span> of <span className="font-semibold text-foreground">{totalStudents}</span> students
                </p>
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-9 w-9 glass-card" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        <ChevronLeft size={16} />
                    </Button>
                    <span className="h-9 w-9 flex items-center justify-center bg-primary text-white rounded-md">{page}</span>
                    <Button variant="outline" size="icon" className="h-9 w-9 glass-card" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
