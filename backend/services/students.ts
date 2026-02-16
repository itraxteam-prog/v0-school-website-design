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
