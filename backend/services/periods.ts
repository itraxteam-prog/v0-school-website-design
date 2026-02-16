import { Period } from '../data/periods';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

export const PeriodService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('periods')
            .select('*');

        if (error) throw new Error(handleSupabaseError(error));
        return data as Period[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('periods')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Period;
    },

    create: async (data: Omit<Period, 'id'>) => {
        const { data: newPeriod, error } = await supabase
            .from('periods')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));
        return newPeriod as Period;
    },

    update: async (id: string, data: Partial<Period>) => {
        const { data: updatedPeriod, error } = await supabase
            .from('periods')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;
        return updatedPeriod as Period;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('periods')
            .delete()
            .eq('id', id);

        if (error) return false;
        return true;
    }
};
