import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Teacher {
    id: string;
    name: string;
    email: string;
    employeeId: string;
    department: string;
    classIds: string[];
    phone?: string;
}

export function useTeachers() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (teachers.length === 0) {
                setTeachers([
                    { id: "1", name: "Mr. Usman Sheikh", email: "usman@school.com", employeeId: "T-001", department: "Mathematics", classIds: ["10-A", "11-B"] },
                    { id: "2", name: "Dr. Ayesha Siddiqui", email: "ayesha@school.com", employeeId: "T-002", department: "Science", classIds: ["9-A", "10-C"] },
                    { id: "3", name: "Ms. Nadia Jamil", email: "nadia@school.com", employeeId: "T-003", department: "English", classIds: ["8-B", "11-A"] }
                ]);
            }
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [teachers.length]);

    const addTeacher = async (teacherData: any) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const newTeacher = {
                ...teacherData,
                id: Math.random().toString(36).substr(2, 9),
            };
            setTeachers(prev => [...prev, newTeacher]);
            toast.success('Teacher added successfully');
            return newTeacher;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
            toast.success('Teacher updated successfully');
            return updates;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTeacher = async (id: string) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setTeachers(prev => prev.filter(t => t.id !== id));
            toast.success('Teacher deleted successfully');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    return {
        teachers,
        loading,
        error,
        refetch: fetchTeachers,
        addTeacher,
        updateTeacher,
        deleteTeacher
    };
}
