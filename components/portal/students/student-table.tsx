"use client"

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Student } from "./student-schema";

interface StudentTableProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="pl-6 font-semibold h-12 uppercase text-[10px] tracking-wider w-[80px]">Photo</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Name</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Roll No</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Class</TableHead>
                        <TableHead className="font-semibold h-12 uppercase text-[10px] tracking-wider">Guardian</TableHead>
                        <TableHead className="pr-6 text-right font-semibold h-12 uppercase text-[10px] tracking-wider">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <TableRow key={student.id} className="border-border/50 transition-colors hover:bg-primary/5 group">
                                <TableCell className="pl-6 py-4">
                                    <Avatar className="h-10 w-10 border border-primary/10">
                                        <AvatarImage src={student.imageUrl} alt={student.name} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-semibold text-foreground py-4">{student.name}</TableCell>
                                <TableCell className="font-medium">
                                    <span className="bg-primary/5 text-primary px-2 py-1 rounded text-xs font-bold">{student.rollNo}</span>
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground font-medium">{student.classId}</TableCell>
                                <TableCell className="py-4 text-muted-foreground">{student.guardianName || "N/A"}</TableCell>
                                <TableCell className="pr-6 text-right py-4">
                                    <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(student)} className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(student)} className="h-8 w-8 hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <div className="md:hidden">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="glass-panel border-border/50">
                                                <DropdownMenuItem onClick={() => onEdit(student)} className="flex items-center gap-2 cursor-pointer">
                                                    <Edit size={14} /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete(student)} className="flex items-center gap-2 cursor-pointer text-destructive">
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                No students found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
