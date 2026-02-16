import { Period } from '../data/periods';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { NotificationService } from './notificationService';

export const PeriodService = {
    // ... (getAll, getById)

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
                            `A new class period has been added: ${data.subject} (${data.startTime} - ${data.endTime})`,
                            user.role
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to send schedule change notifications:', err);
            }
        })();

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
                            `A class period has been updated: ${updatedPeriod.subject}`,
                            user.role
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to send schedule update notifications:', err);
            }
        })();

        return updatedPeriod as Period;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('periods')
            .delete()
            .eq('id', id);

        if (error) return false;
        return true;
    }
};
