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
                    .select('id, title, content, target_audience, created_at');

                if (role) {
                    query = query.in('target_audience', [role + 's', 'all', 'everyone']);
                }

                const { data, error } = await query.order('created_at', { ascending: false });

                if (error) {
                    console.error("Supabase Error [AnnouncementService.getAll]:", error);
                    throw new Error(handleSupabaseError(error));
                }

                return (data as any[]).map(ann => ({
                    id: ann.id,
                    title: ann.title,
                    message: ann.content,
                    createdAt: ann.created_at,
                    audience: [ann.target_audience.replace(/s$/, '')]
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
                    .select('id, title, content, target_audience, created_at')
                    .eq('id', annId)
                    .single();

                if (error) return null;
                return {
                    id: data.id,
                    title: data.title,
                    message: data.content,
                    createdAt: data.created_at,
                    audience: [data.target_audience.replace(/s$/, '')]
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
                target_audience: targetAudience
            }])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        revalidateTag('announcements');

        const mappedAnnouncement = {
            id: newAnnouncement.id,
            title: newAnnouncement.title,
            message: newAnnouncement.content,
            createdAt: newAnnouncement.created_at,
            audience: [newAnnouncement.target_audience.replace(/s$/, '')]
        } as Announcement;

        (async () => {
            try {
                const { data: usersToNotify } = await supabase
                    .from('users')
                    .select('id, role')
                    .eq('role', data.audience[0]);

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
        if (data.audience) updateData.target_audience = data.audience[0] + 's';

        const { data: updated, error } = await supabase
            .from('announcements')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        revalidateTag('announcements');
        revalidateTag(`announcement-${id}`);

        return {
            id: updated.id,
            title: updated.title,
            message: updated.content,
            createdAt: updated.created_at,
            audience: [updated.target_audience.replace(/s$/, '')]
        } as Announcement;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id);

        if (error) return false;

        revalidateTag('announcements');
        revalidateTag(`announcement-${id}`);

        return true;
    }
};
