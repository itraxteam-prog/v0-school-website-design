import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { unstable_cache, revalidateTag } from 'next/cache';

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    last_login?: string;
    created_at?: string;
}

const mapDBToUser = (u: any): User => ({
    ...u,
    role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : u.role,
    last_login: u.updated_at // Use updated_at as a proxy for last activities
});

export const UserService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, email, name, role, status, updated_at, created_at')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Supabase Error [UserService.getAll]:", error);
                    throw new Error(handleSupabaseError(error));
                }
                return (data || []).map(mapDBToUser);
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
                    .select('id, email, name, role, status, updated_at, created_at')
                    .eq('id', userId)
                    .single();

                if (error) return null;
                return mapDBToUser(data);
            },
            [`user-${id}`],
            { tags: ['users', `user-${id}`], revalidate: 60 }
        )(id);
    },

    update: async (id: string, data: Partial<User>) => {
        // Map back if necessary, but here we expect snake_case from service caller if it's internal?
        // Actually the API sends { status: 'Suspended' } which is fine.
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('users');
        revalidateTag(`user-${id}`);
        return mapDBToUser(updatedUser);
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
