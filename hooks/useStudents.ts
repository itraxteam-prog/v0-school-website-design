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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a pure frontend app, we use mock data
            // We'll initialize with some mock students if empty
            if (students.length === 0) {
                setStudents([
                    { id: "1", name: "Hamza Ali", rollNo: "2025-0001", classId: "10-A", email: "hamza@example.com" },
                    { id: "2", name: "Zainab Fatima", rollNo: "2025-0002", classId: "10-A", email: "zainab@example.com" },
                    { id: "3", name: "Omar Farooq", rollNo: "2025-0003", classId: "9-B", email: "omar@example.com" }
                ]);
            }
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [students.length]);

    const addStudent = async (studentData: any) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const newStudent = {
                ...studentData,
                id: Math.random().toString(36).substr(2, 9),
            };
            setStudents(prev => [...prev, newStudent]);
            toast.success('Student added successfully');
            return newStudent;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateStudent = async (id: string, updates: Partial<Student>) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
            toast.success('Student updated successfully');
            return updates;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (id: string) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setStudents(prev => prev.filter(s => s.id !== id));
            toast.success('Student deleted successfully');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
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
