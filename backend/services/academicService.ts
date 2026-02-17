import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export interface AcademicRecord {
    id: string;
    student_id: string;
    subject_id: string;
    term: string;
    marks_obtained: number;
    total_marks: number;
    grade: string;
    exam_date: string;
    remarks: string;
}

export const AcademicService = {
    getStudentRecords: async (studentId: string) => {
        return unstable_cache(
            async (id: string) => {
                const { data, error } = await supabase
                    .from('academic_records')
                    .select(`
                        id, term, marks_obtained, total_marks, grade, exam_date, remarks,
                        subjects (id, name, code)
                    `)
                    .eq('student_id', id)
                    .order('exam_date', { ascending: false });

                if (error) throw new Error(handleSupabaseError(error));
                return data;
            },
            [`student-academic-${studentId}`],
            { tags: ['academic', `student-academic-${studentId}`], revalidate: 3600 }
        )(studentId);
    },

    getGradeDistribution: async (classId?: string) => {
        return unstable_cache(
            async (cid?: string) => {
                let query = supabase
                    .from('academic_records')
                    .select('grade');

                if (cid) {
                    // Filter by students in a specific class
                    const { data: students } = await supabase
                        .from('students')
                        .select('id')
                        .eq('classId', cid);

                    if (students) {
                        query = query.in('student_id', students.map(s => s.id));
                    }
                }

                const { data, error } = await query;
                if (error) throw new Error(handleSupabaseError(error));

                const distribution = (data as any[]).reduce((acc, curr) => {
                    acc[curr.grade] = (acc[curr.grade] || 0) + 1;
                    return acc;
                }, {});

                return Object.entries(distribution).map(([grade, count]) => ({ grade, count }));
            },
            [`grade-distribution-${classId || 'all'}`],
            { tags: ['academic'], revalidate: 3600 }
        )(classId);
    },

    upsertRecord: async (data: Partial<AcademicRecord>) => {
        const { data: record, error } = await supabase
            .from('academic_records')
            .upsert(data)
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('academic');
        if (data.student_id) {
            revalidateTag(`student-academic-${data.student_id}`);
        }
        return record;
    }
};
