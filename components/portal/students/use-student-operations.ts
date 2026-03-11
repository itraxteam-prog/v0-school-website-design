import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Student, StudentFormValues } from "./student-schema";

export function useStudentOperations(initialPage: number = 1, initialSearch: string = "") {
    const router = useRouter();
    const { toast } = useToast();
    
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const limit = 10;

    const fetchClasses = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/classes", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch classes");
            const result = await res.json();
            setClasses(result.data || []);
        } catch (err) {
            console.error("Failed to fetch classes", err);
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `/api/admin/students?page=${page}&limit=${limit}&search=${searchTerm}`;
            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch students");
            const result = await res.json();
            setStudents(result.data || []);
            setTotalPages(result.pagination?.pages || 1);
            setTotalStudents(result.pagination?.total || (result.data ? result.data.length : 0));
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    const deleteStudent = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            const res = await fetch(`/api/admin/students/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to delete student");
            
            setStudents(prev => prev.filter(s => s.id !== id));
            toast({
                title: "Deleted",
                description: "Student record has been removed.",
            });
            router.refresh();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, [fetchStudents, fetchClasses]);

    return {
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
    };
}
