import { Announcement } from '../data/announcements';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

export const AnnouncementService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*');

        if (error) throw new Error(handleSupabaseError(error));

        return (data as any[]).map(a => ({
            id: a.id,
            title: a.title,
            message: a.content,
            createdAt: a.createdAt,
            audience: [a.targetAudience.replace(/s$/, '')] // Map 'students' to 'student' etc.
        })) as Announcement[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('id', id)
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

    create: async (data: Omit<Announcement, 'id' | 'createdAt'>) => {
        const { data: newAnnouncement, error } = await supabase
            .from('announcements')
            .insert([{
                title: data.title,
                content: data.message,
                targetAudience: data.audience[0] + 's' // Simple mapping back
            }])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        return {
            id: newAnnouncement.id,
            title: newAnnouncement.title,
            message: newAnnouncement.content,
            createdAt: newAnnouncement.createdAt,
            audience: [newAnnouncement.targetAudience.replace(/s$/, '')]
        } as Announcement;
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
