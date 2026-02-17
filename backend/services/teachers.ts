import { Teacher } from '../data/teachers';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export const TeacherService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('id, name, email, phone, subjects, classIds, profilePhoto');

                if (error) throw new Error(handleSupabaseError(error));
                return data as Teacher[];
            },
            ['teachers-list'],
            { tags: ['teachers'], revalidate: 3600 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (teacherId: string) => {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('id, name, email, phone, subjects, classIds, profilePhoto')
                    .eq('id', teacherId)
                    .single();

                if (error) return null;
                return data as Teacher;
            },
            [`teacher-${id}`],
            { tags: ['teachers', `teacher-${id}`], revalidate: 3600 }
        )(id);
    },

    create: async (data: Omit<Teacher, 'id'>) => {
        const { data: newTeacher, error } = await supabase
            .from('teachers')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        // Invalidate cache
        revalidateTag('teachers');

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

        // Invalidate cache
        revalidateTag('teachers');
        revalidateTag(`teacher-${id}`);

        return updatedTeacher as Teacher;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('teachers')
            .delete()
            .eq('id', id);

        if (error) return false;

        // Invalidate cache
        revalidateTag('teachers');
        revalidateTag(`teacher-${id}`);

        return true;
    }
};
