import { Announcement } from '../data/announcements';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { NotificationService } from './notificationService';
import { unstable_cache, revalidateTag } from 'next/cache';

export const AnnouncementService = {
    getAll: async (filterByRole?: string) => {
        return unstable_cache(
            async (role?: string) => {
                let query = supabase.from('announcements')
                    .select('id, title, content, targetAudience, createdAt');

                if (role) {
                    query = query.in('targetAudience', [role + 's', 'all', 'everyone']);
                }

                const { data, error } = await query.order('createdAt', { ascending: false });

                if (error) throw new Error(handleSupabaseError(error));
                return (data as any[]).map(ann => ({
                    id: ann.id,
                    title: ann.title,
                    message: ann.content,
                    createdAt: ann.createdAt,
                    audience: [ann.targetAudience.replace(/s$/, '')]
                })) as Announcement[];
            },
            [`announcements-list-${filterByRole || 'all'}`],
            { tags: ['announcements'], revalidate: 3600 }
        )(filterByRole);
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (annId: string) => {
                const { data, error } = await supabase
                    .from('announcements')
                    .select('id, title, content, targetAudience, createdAt')
                    .eq('id', annId)
                    .single();

                if (error) return null;
                return {
                    id: data.id,
                    title: data.title,
                    message: data.content,
                    createdAt: data.createdAt,
                    audience: [data.targetAudience.replace(/s$/, '')]
                } as Announcement;
            },
            [`announcement-${id}`],
            { tags: ['announcements', `announcement-${id}`], revalidate: 3600 }
        )(id);
    },

    create: async (data: Omit<Announcement, 'id' | 'createdAt'>) => {
        const targetAudience = data.audience[0] + 's';
        const { data: newAnnouncement, error } = await supabase
            .from('announcements')
            .insert([{
                title: data.title,
                content: data.message,
                targetAudience: targetAudience
            }])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        // Invalidate cache
        revalidateTag('announcements');

        const mappedAnnouncement = {
            id: newAnnouncement.id,
            title: newAnnouncement.title,
            message: newAnnouncement.content,
            createdAt: newAnnouncement.createdAt,
            audience: [newAnnouncement.targetAudience.replace(/s$/, '')]
        } as Announcement;

        // Notify relevant users (Async)
        (async () => {
            try {
                // Fetch users in the target role
                const { data: usersToNotify } = await supabase
                    .from('users')
                    .select('id, role')
                    .eq('role', data.audience[0]); // e.g., 'student'

                if (usersToNotify && usersToNotify.length > 0) {
                    for (const user of usersToNotify) {
                        NotificationService.sendEmailNotification(
                            user.id,
                            'NEW_ANNOUNCEMENT',
                            `A new announcement has been posted: ${data.title}`,
                            user.role
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to trigger announcement notifications:', err);
            }
        })();

        return mappedAnnouncement;
    },

    update: async (id: string, data: Partial<Announcement>) => {
        const updateData: any = {};
        if (data.title) updateData.title = data.title;
        if (data.message) updateData.content = data.message;
        if (data.audience) updateData.targetAudience = data.audience[0] + 's';

        const { data: updated, error } = await supabase
            .from('announcements')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        // Invalidate cache
        revalidateTag('announcements');
        revalidateTag(`announcement-${id}`);

        return {
            id: updated.id,
            title: updated.title,
            message: updated.content,
            createdAt: updated.createdAt,
            audience: [updated.targetAudience.replace(/s$/, '')]
        } as Announcement;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id);

        if (error) return false;

        // Invalidate cache
        revalidateTag('announcements');
        revalidateTag(`announcement-${id}`);

        return true;
    }
};
