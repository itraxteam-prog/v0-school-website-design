import { Student } from '../data/students';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

export const StudentService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('students')
            .select('*');

        if (error) throw new Error(handleSupabaseError(error));
        return data as Student[];
    },

    getByTeacherId: async (teacherId: string) => {
        // 1. Get classes taught by teacher
        const { data: classes, error: classError } = await supabase
            .from('classes')
            .select('id')
            .eq('classTeacherId', teacherId);

        if (classError || !classes) return [];
        const classIds = classes.map(c => c.id);

        if (classIds.length === 0) return [];

        // 2. Get students in those classes
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .in('classId', classIds);

        if (error) return [];
        return data as Student[];
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
            .eq('id', student['classId']) // Fix for TS potentially
            .eq('classTeacherId', teacherId)
            .single();

        return !!classData && !classError;
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Student;
    },

    create: async (data: Omit<Student, 'id'>) => {
        const { data: newStudent, error } = await supabase
            .from('students')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));
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
        return updatedStudent as Student;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) return false;
        return true;
    }
};
