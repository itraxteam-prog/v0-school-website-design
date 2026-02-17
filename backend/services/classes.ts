import { Class } from '../data/classes';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { NotificationService } from './notificationService';
import { unstable_cache, revalidateTag } from 'next/cache';

export const ClassService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('classes')
                    .select('id, name, classTeacherId, roomNo, studentIds');

                if (error) throw new Error(handleSupabaseError(error));
                return data as Class[];
            },
            ['classes-list'],
            { tags: ['classes'], revalidate: 3600 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (classId: string) => {
                const { data, error } = await supabase
                    .from('classes')
                    .select('id, name, classTeacherId, roomNo, studentIds')
                    .eq('id', classId)
                    .single();

                if (error) return null;
                return data as Class;
            },
            [`class-${id}`],
            { tags: ['classes', `class-${id}`], revalidate: 3600 }
        )(id);
    },

    create: async (data: Omit<Class, 'id'>) => {
        const { data: newClass, error } = await supabase
            .from('classes')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        // Invalidate cache
        revalidateTag('classes');

        // Notify assigned teacher
        if (newClass.classTeacherId) {
            NotificationService.sendEmailNotification(
                newClass.classTeacherId,
                'CLASS_ASSIGNED',
                `You have been assigned as the class teacher for ${newClass.name}.`,
                'teacher'
            );
        }

        return newClass;
    },

    update: async (id: string, data: Partial<any>) => {
        // Fetch current class to see if teacher changed
        const current = await ClassService.getById(id);

        const { data: updatedClass, error } = await supabase
            .from('classes')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        // Invalidate cache
        revalidateTag('classes');
        revalidateTag(`class-${id}`);

        // If teacher changed, notify the new one
        if (data.classTeacherId && data.classTeacherId !== current?.classTeacherId) {
            NotificationService.sendEmailNotification(
                data.classTeacherId,
                'CLASS_ASSIGNED_UPDATE',
                `You have been assigned as the new class teacher for ${updatedClass.name}.`,
                'teacher'
            );
        }

        return updatedClass;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('classes')
            .delete()
            .eq('id', id);

        if (error) return false;

        // Invalidate cache
        revalidateTag('classes');
        revalidateTag(`class-${id}`);

        return true;
    }
};
