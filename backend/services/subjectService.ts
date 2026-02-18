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
                console.warn("SubjectService.getAll: Supabase logic removed.");
                return [] as Subject[];
            },
            ['subjects-list'],
            { tags: ['subjects'], revalidate: 86400 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (subId: string) => {
                console.warn(`SubjectService.getById(${subId}): Supabase logic removed.`);
                return null;
            },
            [`subject-${id}`],
            { tags: ['subjects', `subject-${id}`], revalidate: 86400 }
        )(id);
    },

    create: async (data: Omit<Subject, 'id'>) => {
        console.warn("SubjectService.create: Supabase logic removed.");
        revalidateTag('subjects');
        return null as any;
    },

    update: async (id: string, data: Partial<Subject>) => {
        console.warn(`SubjectService.update(${id}): Supabase logic removed.`);
        revalidateTag('subjects');
        revalidateTag(`subject-${id}`);
        return null as any;
    },

    delete: async (id: string) => {
        console.warn(`SubjectService.delete(${id}): Supabase logic removed.`);
        revalidateTag('subjects');
        revalidateTag(`subject-${id}`);
        return true;
    }
};
