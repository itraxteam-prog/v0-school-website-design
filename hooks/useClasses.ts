import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Class {
    id: string;
    name: string;
    classTeacherId: string;
    roomNo: string;
    schedule?: any;
    capacity?: number;
}

export function useClasses() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/classes');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch classes');
            }
            const data = await res.json();
            setClasses(data);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addClass = async (classData: any) => {
        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(classData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add class');
            }

            const newClass = await res.json();
            setClasses(prev => [...prev, newClass]);
            toast.success('Class added successfully');
            return newClass;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const updateClass = async (id: string, updates: Partial<Class>) => {
        try {
            const res = await fetch(`/api/classes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update class');
            }

            const updated = await res.json();
            setClasses(prev => prev.map(c => c.id === id ? updated : c));
            toast.success('Class updated successfully');
            return updated;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const deleteClass = async (id: string) => {
        try {
            const res = await fetch(`/api/classes/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete class');
            }

            setClasses(prev => prev.filter(c => c.id !== id));
            toast.success('Class deleted successfully');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    return {
        classes,
        loading,
        error,
        refetch: fetchClasses,
        addClass,
        updateClass,
        deleteClass
    };
}
