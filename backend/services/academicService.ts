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
                console.warn(`AcademicService.getStudentRecords(${id}): Supabase logic removed.`);
                return [];
            },
            [`student-academic-${studentId}`],
            { tags: ['academic', `student-academic-${studentId}`], revalidate: 3600 }
        )(studentId);
    },

    getGradeDistribution: async (classId?: string) => {
        return unstable_cache(
            async (cid?: string) => {
                console.warn(`AcademicService.getGradeDistribution(${cid}): Supabase logic removed.`);
                return [];
            },
            [`grade-distribution-${classId || 'all'}`],
            { tags: ['academic'], revalidate: 3600 }
        )(classId);
    },

    getClassRecords: async (classId: string, subjectId: string, term: string) => {
        return unstable_cache(
            async (cid: string, sid: string, t: string) => {
                console.warn(`AcademicService.getClassRecords(${cid}, ${sid}, ${t}): Supabase logic removed.`);
                return [];
            },
            [`class-records-${classId}-${subjectId}-${term}`],
            { tags: ['academic', `class-records-${classId}`], revalidate: 3600 }
        )(classId, subjectId, term);
    },

    upsertBulk: async (records: Partial<AcademicRecord>[]) => {
        console.warn("AcademicService.upsertBulk: Supabase logic removed.");
        revalidateTag('academic');
        return [];
    },

    upsertRecord: async (data: Partial<AcademicRecord>) => {
        console.warn("AcademicService.upsertRecord: Supabase logic removed.");
        revalidateTag('academic');
        return null;
    }
};
