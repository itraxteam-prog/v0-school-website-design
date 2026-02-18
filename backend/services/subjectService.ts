import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export interface Subject {
    id: string;
    name: string;
    code: string;
    department: string;
    created_at?: string;
}

export const SubjectService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('subjects')
                    .select('id, name, code, department')
                    .order('name');

                if (error) throw new Error(handleSupabaseError(error));
                return data as Subject[];
            },
            ['subjects-list'],
            { tags: ['subjects'], revalidate: 86400 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (subId: string) => {
                const { data, error } = await supabase
                    .from('subjects')
                    .select('id, name, code, department')
                    .eq('id', subId)
                    .single();

                if (error) return null;
                return data as Subject;
            },
            [`subject-${id}`],
            { tags: ['subjects', `subject-${id}`], revalidate: 86400 }
        )(id);
    },

    create: async (data: Omit<Subject, 'id'>) => {
        const { data: newSubject, error } = await supabase
            .from('subjects')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('subjects');
        return newSubject as Subject;
    },

    update: async (id: string, data: Partial<Subject>) => {
        const { data: updatedSubject, error } = await supabase
            .from('subjects')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('subjects');
        revalidateTag(`subject-${id}`);
        return updatedSubject as Subject;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', id);

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('subjects');
        revalidateTag(`subject-${id}`);
        return true;
    }
};
