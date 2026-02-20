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
            await new Promise(resolve => setTimeout(resolve, 600));
            // Simulate fetching records for the class
            // In a real mock, we might store this in local storage
            setAttendance([]);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAttendance = async (classId: string, date: string, records: any[]) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAttendance(records);
            toast.success('Attendance marked successfully');
            return records;
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
