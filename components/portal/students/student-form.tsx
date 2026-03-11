"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Loader2, Eye, EyeOff } from "lucide-react";
import { studentSchema, StudentFormValues, Student } from "./student-schema";
import { useToast } from "@/components/ui/use-toast";

interface StudentFormProps {
    editingStudent: Student | null;
    onSubmit: (data: StudentFormValues, file: File | null) => Promise<void>;
    isSubmitting: boolean;
    onCancel: () => void;
    classes: { id: string, name: string }[];
}

export function StudentForm({ editingStudent, onSubmit, isSubmitting, onCancel, classes }: StudentFormProps) {
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(editingStudent?.imageUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const methods = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: "",
            email: "",
            rollNo: "",
            classId: "",
            dob: "",
            gender: "",
            bloodGroup: "",
            nationality: "Pakistani",
            admissionDate: new Date().toISOString().split('T')[0],
            phone: "",
            city: "",
            postalCode: "",
            guardianName: "",
            guardianPhone: "",
            guardianEmail: "",
            guardianRelation: "",
            guardianOccupation: "",
            address: "",
            imageUrl: "",
            password: "",
        },
    });

    useEffect(() => {
        if (editingStudent) {
            methods.reset({
                ...editingStudent,
                password: "", // Don't populate password
            });
            setImagePreview(editingStudent.imageUrl || null);
        } else {
            methods.reset({
                name: "",
                email: "",
                rollNo: "",
                classId: "",
                dob: "",
                gender: "",
                bloodGroup: "",
                nationality: "Pakistani",
                admissionDate: new Date().toISOString().split('T')[0],
                phone: "",
                city: "",
                postalCode: "",
                guardianName: "",
                guardianPhone: "",
                guardianEmail: "",
                guardianRelation: "",
                guardianOccupation: "",
                address: "",
                imageUrl: "",
                password: "",
            });
            setImagePreview(null);
            setSelectedFile(null);
        }
    }, [editingStudent, methods]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Form {...methods}>
            <form onSubmit={methods.handleSubmit((data) => onSubmit(data, selectedFile))} className="space-y-4 pt-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                            <AvatarImage src={imagePreview || ""} />
                            <AvatarFallback className="bg-primary/5 text-primary">
                                <User className="h-10 w-10 text-primary/40" />
                            </AvatarFallback>
                        </Avatar>
                        <label htmlFor="student-image-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Upload className="h-6 w-6 text-white" />
                        </label>
                        <input id="student-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={methods.control} name="name" render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} className="glass-card" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <FormField control={methods.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input placeholder="john@example.com" {...field} className="glass-card" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={methods.control} name="rollNo" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Roll Number</FormLabel>
                            <FormControl><Input placeholder="2024-0001" {...field} className="glass-card" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={methods.control} name="classId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="glass-card">
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={methods.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password {editingStudent ? "(Leave blank to keep current)" : ""}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="glass-card" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Add other fields as needed or collapsed sections */}
                    <div className="col-span-2 space-y-4">
                        <h4 className="text-sm font-semibold border-b pb-1">Additional Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={methods.control} name="dob" render={({ field }) => (
                                <FormItem><FormLabel>DOB</FormLabel><FormControl><Input type="date" {...field} className="glass-card" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={methods.control} name="gender" render={({ field }) => (
                                <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="glass-card"><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary text-white shadow-burgundy-glow min-w-[120px]">
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> saving...</> : (editingStudent ? 'Update' : 'Add Student')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
