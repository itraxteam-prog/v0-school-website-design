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
            const res = await fetch('/api/teachers');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch teachers');
            }
            const data = await res.json();
            setTeachers(data);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addTeacher = async (teacherData: any) => {
        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teacherData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add teacher');
            }

            const newTeacher = await res.json();
            setTeachers(prev => [...prev, newTeacher]);
            toast.success('Teacher added successfully');
            return newTeacher;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
        try {
            const res = await fetch(`/api/teachers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update teacher');
            }

            const updated = await res.json();
            setTeachers(prev => prev.map(t => t.id === id ? updated : t));
            toast.success('Teacher updated successfully');
            return updated;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const deleteTeacher = async (id: string) => {
        try {
            const res = await fetch(`/api/teachers/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete teacher');
            }

            setTeachers(prev => prev.filter(t => t.id !== id));
            toast.success('Teacher deleted successfully');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
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
