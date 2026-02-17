import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Student {
    id: string;
    name: string;
    rollNo: string;
    classId: string;
    email?: string;
    phone?: string;
    gender?: string;
    dob?: string;
    enrollmentDate?: string;
    address?: string;
    guardianName?: string;
    guardianPhone?: string;
}

export function useStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/students');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch students');
            }
            const data = await res.json();
            setStudents(data);
        } catch (err: any) {
            setError(err.message);
            // Don't toast on initial load error to avoid spam, just set error state
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addStudent = async (studentData: any) => {
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add student');
            }

            const newStudent = await res.json();
            setStudents(prev => [...prev, newStudent]);
            toast.success('Student added successfully');
            return newStudent;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const updateStudent = async (id: string, updates: Partial<Student>) => {
        try {
            const res = await fetch(`/api/students/${id}`, { // Note: Backend implementation for PUT /[id] needs to be verified
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update student');
            }

            const updated = await res.json();
            setStudents(prev => prev.map(s => s.id === id ? updated : s));
            toast.success('Student updated successfully');
            return updated;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const deleteStudent = async (id: string) => {
        try {
            const res = await fetch(`/api/students/${id}`, { // Backend implementation for DELETE /[id] needs to be verified
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete student');
            }

            setStudents(prev => prev.filter(s => s.id !== id));
            toast.success('Student deleted successfully');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return {
        students,
        loading,
        error,
        refetch: fetchStudents,
        addStudent,
        updateStudent,
        deleteStudent
    };
}
