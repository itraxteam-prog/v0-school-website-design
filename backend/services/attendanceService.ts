import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export interface AttendanceRecord {
    id: string;
    student_id: string;
    class_id: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    date: string;
    recorded_by: string;
}

export const AttendanceService = {
    getClassAttendance: async (classId: string, date: string) => {
        return unstable_cache(
            async (cid: string, d: string) => {
                const { data, error } = await supabase
                    .from('attendance')
                    .select('id, student_id, status, date')
                    .eq('class_id', cid)
                    .eq('date', d);

                if (error) throw new Error(handleSupabaseError(error));
                return data as AttendanceRecord[];
            },
            [`attendance-${classId}-${date}`],
            { tags: ['attendance', `class-attendance-${classId}`], revalidate: 3600 }
        )(classId, date);
    },

    getInstitutionalAttendanceStats: async () => {
        return unstable_cache(
            async () => {
                // Aggregated stats for the last 6 months
                const { data, error } = await supabase
                    .rpc('get_attendance_trends'); // Assumes a custom RPC for optimization

                if (error) {
                    // Fallback to manual aggregation if RPC doesn't exist
                    const { data: allData } = await supabase
                        .from('attendance')
                        .select('status, date')
                        .gte('date', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString());

                    if (!allData) return [];

                    // Manual aggregation logic would go here
                    return allData;
                }
                return data;
            },
            ['attendance-trends'],
            { tags: ['attendance'], revalidate: 3600 }
        )();
    },

    recordBulkAttendance: async (records: Omit<AttendanceRecord, 'id'>[]) => {
        const { data, error } = await supabase
            .from('attendance')
            .upsert(records, { onConflict: 'student_id, date' })
            .select();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('attendance');
        records.forEach(r => revalidateTag(`class-attendance-${r.class_id}`));

        return data;
    }
};
