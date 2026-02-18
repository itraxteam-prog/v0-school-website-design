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
                // Supabase logic removed
                console.warn("UserService.getAll: Supabase logic removed.");
                return [] as User[];
            },
            ['users-list'],
            { tags: ['users'], revalidate: 60 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (userId: string) => {
                // Supabase logic removed
                console.warn(`UserService.getById(${userId}): Supabase logic removed.`);
                return null;
            },
            [`user-${id}`],
            { tags: ['users', `user-${id}`], revalidate: 60 }
        )(id);
    },

    update: async (id: string, data: Partial<User>) => {
        // Supabase logic removed
        console.warn(`UserService.update(${id}): Supabase logic removed.`);
        revalidateTag('users');
        revalidateTag(`user-${id}`);
        return null as any;
    },

    delete: async (id: string) => {
        // Supabase logic removed
        console.warn(`UserService.delete(${id}): Supabase logic removed.`);
        revalidateTag('users');
        revalidateTag(`user-${id}`);
        return true;
    }
};
