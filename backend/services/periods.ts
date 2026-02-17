import { Period } from '../data/periods';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { NotificationService } from './notificationService';
import { unstable_cache, revalidateTag } from 'next/cache';

export const PeriodService = {
    getAll: async () => {
        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from('periods')
                    .select('*');

                if (error) throw new Error(handleSupabaseError(error));
                return data as Period[];
            },
            ['periods-list'],
            { tags: ['periods'], revalidate: 3600 }
        )();
    },

    getById: async (id: string) => {
        return unstable_cache(
            async (periodId: string) => {
                const { data, error } = await supabase
                    .from('periods')
                    .select('*')
                    .eq('id', periodId)
                    .single();

                if (error) return null;
                return data as Period;
            },
            [`period-${id}`],
            { tags: ['periods', `period-${id}`], revalidate: 3600 }
        )(id);
    },

    getByClassIds: async (classIds: string[]) => {
        return unstable_cache(
            async (cids: string[]) => {
                if (!cids.length) return [];
                const { data, error } = await supabase
                    .from('periods')
                    .select('*')
                    .in('classId', cids);

                if (error) return [];
                return data as Period[];
            },
            [`periods-classes-${classIds.sort().join('-')}`],
            { tags: ['periods'], revalidate: 3600 }
        )(classIds);
    },

    create: async (data: Omit<Period, 'id'>) => {
        const { data: newPeriod, error } = await supabase
            .from('periods')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(handleSupabaseError(error));

        // Notify teachers and students about the new period (Async)
        (async () => {
            try {
                // Fetch relevant users or just do a generic role-based notify
                const { data: users } = await supabase.from('users').select('id, role').in('role', ['teacher', 'student']);
                if (users) {
                    for (const user of users) {
                        NotificationService.sendEmailNotification(
                            user.id,
                            'SCHEDULE_CHANGE',
                            `A new class period has been added: ${data.name} (${data.startTime} - ${data.endTime})`,
                            user.role
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to send schedule change notifications:', err);
            }
        })();

        // Invalidate cache
        revalidateTag('periods');

        return newPeriod as Period;
    },

    update: async (id: string, data: Partial<Period>) => {
        const { data: updatedPeriod, error } = await supabase
            .from('periods')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        // Notify about update (Async)
        (async () => {
            try {
                const { data: users } = await supabase.from('users').select('id, role').in('role', ['teacher', 'student']);
                if (users) {
                    for (const user of users) {
                        NotificationService.sendEmailNotification(
                            user.id,
                            'SCHEDULE_UPDATE',
                            `A class period has been updated: ${updatedPeriod.name}`,
                            user.role
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to send schedule update notifications:', err);
            }
        })();

        // Invalidate cache
        revalidateTag('periods');
        revalidateTag(`period-${id}`);

        return updatedPeriod as Period;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('periods')
            .delete()
            .eq('id', id);

        if (error) return false;

        // Invalidate cache
        revalidateTag('periods');
        revalidateTag(`period-${id}`);

        return true;
    }
};
