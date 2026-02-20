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
            await new Promise(resolve => setTimeout(resolve, 500));
            if (classes.length === 0) {
                setClasses([
                    { id: "1", name: "Grade 10-A", classTeacherId: "1", roomNo: "Room 204", capacity: 35 },
                    { id: "2", name: "Grade 11-B", classTeacherId: "2", roomNo: "Room 305", capacity: 30 },
                    { id: "3", name: "Grade 9-A", classTeacherId: "3", roomNo: "Room 102", capacity: 32 }
                ]);
            }
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [classes.length]);

    const addClass = async (classData: any) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const newClass = {
                ...classData,
                id: Math.random().toString(36).substr(2, 9),
            };
            setClasses(prev => [...prev, newClass]);
            toast.success('Class added successfully');
            return newClass;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateClass = async (id: string, updates: Partial<Class>) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            toast.success('Class updated successfully');
            return updates;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteClass = async (id: string) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setClasses(prev => prev.filter(c => c.id !== id));
            toast.success('Class deleted successfully');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
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
