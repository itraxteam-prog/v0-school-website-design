import { Announcement } from '../data/announcements';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { NotificationService } from './notificationService';

export const AnnouncementService = {
    getAll: async (filterByRole?: string) => {
        let query = supabase.from('announcements').select('*');

        if (filterByRole) {
            // Check if audience is 'students', 'teachers', or 'all' if we had it. 
            // Current schema stores audience as 'students' or 'teachers'.
            // We'll filter for matching audience OR 'all' if we add that later.
            // For now, simple exact match or contained in logic.
            query = query.in('targetAudience', [filterByRole + 's', 'all', 'everyone']);
        }

        const { data, error } = await query.order('createdAt', { ascending: false });

        if (error) throw new Error(handleSupabaseError(error));
        return data as Announcement[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Announcement;
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
        return true;
    }
};
