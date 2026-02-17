import { Student } from '../data/students';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export const StudentService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('students')
                    .select('id, name, rollNo, classId, email, phone, gender, dob, enrollmentDate, address, guardianName, guardianPhone');

                if (error) throw new Error(handleSupabaseError(error));
                return data as Student[];
            },
            ['students-list'],
            { tags: ['students'], revalidate: 3600 }
        )();
    },

    getByTeacherId: async (teacherId: string) => {
        return unstable_cache(
            async (id: string) => {
                // 1. Get classes taught by teacher
                const { data: classes, error: classError } = await supabase
                    .from('classes')
                    .select('id')
                    .eq('classTeacherId', id);

                if (classError || !classes) return [];
                const classIds = classes.map(c => c.id);

                if (classIds.length === 0) return [];

                // 2. Get students in those classes
                const { data, error } = await supabase
                    .from('students')
                    .select('id, name, rollNo, classId, email, phone, gender, dob, enrollmentDate, address, guardianName, guardianPhone')
                    .in('classId', classIds);

                if (error) return [];
                return data as Student[];
            },
            [`students-teacher-${teacherId}`],
            { tags: ['students', 'classes'], revalidate: 3600 }
        )(teacherId);
    },

    getByClassId: async (classId: string) => {
        return unstable_cache(
            async (cid: string) => {
                const { data, error } = await supabase
                    .from('students')
                    .select('id, name, rollNo, classId, email, phone, gender, dob, enrollmentDate, address, guardianName, guardianPhone')
                    .eq('classId', cid)
                    .order('name');

                if (error) return [];
                return data as Student[];
            },
            [`students-class-${classId}`],
            { tags: ['students', `class-students-${classId}`], revalidate: 3600 }
        )(classId);
    },

    isStudentInTeacherClass: async (teacherId: string, studentId: string) => {
        // Get student's class
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('classId')
            .eq('id', studentId)
            .single();

        if (studentError || !student) return false;

        // Check if teacher teaches this class
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('id')
            .eq('id', student['classId'])
            .eq('classTeacherId', teacherId)
            .single();

        return !!classData && !classError;
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (studentId: string) => {
                const { data, error } = await supabase
                    .from('students')
                    .select('id, name, rollNo, classId, email, phone, gender, dob, enrollmentDate, address, guardianName, guardianPhone')
                    .eq('id', studentId)
                    .single();

                if (error) return null;
                return data as Student;
            },
            [`student-${id}`],
            { tags: ['students', `student-${id}`], revalidate: 3600 }
        )(id);
    },

    create: async (data: Omit<Student, 'id'>) => {
        const { data: newStudent, error } = await supabase
            .from('students')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        // Invalidate cache
        revalidateTag('students');

        return newStudent as Student;
    },

    update: async (id: string, data: Partial<Student>) => {
        const { data: updatedStudent, error } = await supabase
            .from('students')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        // Invalidate cache
        revalidateTag('students');
        revalidateTag(`student-${id}`);

        return updatedStudent as Student;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) return false;

        // Invalidate cache
        revalidateTag('students');
        revalidateTag(`student-${id}`);

        return true;
    }
};
