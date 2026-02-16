import { Class } from '../data/classes';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

export const ClassService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('classes')
            .select('*');

        if (error) throw new Error(handleSupabaseError(error));
        return data as Class[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Class;
    },

    create: async (data: Omit<Class, 'id'>) => {
        const { data: newClass, error } = await supabase
            .from('classes')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));
        return newClass as Class;
    },

    update: async (id: string, data: Partial<Class>) => {
        const { data: updatedClass, error } = await supabase
            .from('classes')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;
        return updatedClass as Class;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('classes')
            .delete()
            .eq('id', id);

        if (error) return false;
        return true;
    }
};
