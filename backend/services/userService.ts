import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'Admin' | 'Teacher' | 'Student';
    status: 'Active' | 'Suspended';
    last_login?: string;
    created_at?: string;
}

export const UserService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, email, name, role, status, last_login, created_at')
                    .order('created_at', { ascending: false });

                if (error) throw new Error(handleSupabaseError(error));
                return data as User[];
            },
            ['users-list'],
            { tags: ['users'], revalidate: 60 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (userId: string) => {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, email, name, role, status, last_login, created_at')
                    .eq('id', userId)
                    .single();

                if (error) return null;
                return data as User;
            },
            [`user-${id}`],
            { tags: ['users', `user-${id}`], revalidate: 60 }
        )(id);
    },

    update: async (id: string, data: Partial<User>) => {
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('users');
        revalidateTag(`user-${id}`);
        return updatedUser as User;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('users');
        revalidateTag(`user-${id}`);
        return true;
    }
};
