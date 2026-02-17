import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AttendanceRecord {
    id?: string;
    studentId: string;
    classId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
}

export function useAttendance() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClassAttendance = useCallback(async (classId: string, date: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/attendance?classId=${classId}&date=${date}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch attendance');
            }
            const data = await res.json();
            setAttendance(data);
        } catch (err: any) {
            setError(err.message);
            // Don't toast for fetching errors unless needed
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAttendance = async (classId: string, date: string, records: any[]) => {
        setLoading(true);
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId, date, records }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to mark attendance');
            }

            const data = await res.json();
            setAttendance(data); // Assuming response returns updated records, or we should re-fetch
            toast.success('Attendance marked successfully');
            return data;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        attendance,
        loading,
        error,
        fetchClassAttendance,
        markAttendance
    };
}
