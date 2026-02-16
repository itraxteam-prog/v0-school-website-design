import { Teacher } from '../data/teachers';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

export const TeacherService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('teachers')
            .select('*');

        if (error) throw new Error(handleSupabaseError(error));
        return data as Teacher[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Teacher;
    },

    create: async (data: Omit<Teacher, 'id'>) => {
        const { data: newTeacher, error } = await supabase
            .from('teachers')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));
        return newTeacher as Teacher;
    },

    update: async (id: string, data: Partial<Teacher>) => {
        const { data: updatedTeacher, error } = await supabase
            .from('teachers')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;
        return updatedTeacher as Teacher;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('teachers')
            .delete()
            .eq('id', id);

        if (error) return false;
        return true;
    }
};
