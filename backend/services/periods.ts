import { Period } from '../types';
import { supabase } from '../utils/supabaseClient';
import { NotificationService } from './notificationService';
import { revalidateTag } from 'next/cache';

export const PeriodService = {
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('periods')
                .select('id, name, start_time, end_time, class_id')
                .order('start_time', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                startTime: item.start_time,
                endTime: item.end_time,
                classId: item.class_id
            })) as Period[];
        } catch (error: any) {
            console.error('PeriodService.getAll Error:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('periods')
                .select('id, name, start_time, end_time, class_id')
                .eq('id', id)
                .single();

            if (error) return null;

            return {
                id: data.id,
                name: data.name,
                startTime: data.start_time,
                endTime: data.end_time,
                classId: data.class_id
            } as Period;
        } catch (error: any) {
            console.error('PeriodService.getById Error:', error);
            throw error;
        }
    },

    getByClassIds: async (classIds: string[]) => {
        try {
            if (!classIds.length) return [];
            const { data, error } = await supabase
                .from('periods')
                .select('id, name, start_time, end_time, class_id')
                .in('class_id', classIds)
                .order('start_time', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                startTime: item.start_time,
                endTime: item.end_time,
                classId: item.class_id
            })) as Period[];
        } catch (error: any) {
            console.error('PeriodService.getByClassIds Error:', error);
            return [];
        }
    },

    create: async (data: Omit<Period, 'id'>) => {
        try {
            console.log('PeriodService.create - Data received:', data);
            const id = `prd-${Math.random().toString(36).substr(2, 9)}`;

            const { data: newPeriodData, error } = await supabase
                .from('periods')
                .insert({
                    id,
                    name: data.name,
                    start_time: data.startTime,
                    end_time: data.endTime,
                    class_id: data.classId
                })
                .select('id, name, start_time, end_time, class_id')
                .single();

            if (error || !newPeriodData) {
                throw new Error(error?.message || 'Failed to insert period');
            }

            const newPeriod = {
                id: newPeriodData.id,
                name: newPeriodData.name,
                startTime: newPeriodData.start_time,
                endTime: newPeriodData.end_time,
                classId: newPeriodData.class_id
            } as Period;

            console.log('PeriodService.create - Period created successfully:', newPeriod.id);
            revalidateTag('periods');

            // Notify about schedule change (Generic notify for now)
            try {
                // Background notify
                (async () => {
                    const { data: users } = await supabase
                        .from('users')
                        .select('id, role')
                        .in('role', ['teacher', 'student']);

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
                })();
            } catch (notifyError) {
                console.error('Failed to send period notifications:', notifyError);
            }

            return newPeriod;
        } catch (error: any) {
            console.error('PeriodService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<Period>) => {
        try {
            const current = await PeriodService.getById(id);
            if (!current) return null;

            const updateData = {
                name: data.name ?? current.name,
                start_time: data.startTime ?? current.startTime,
                end_time: data.endTime ?? current.endTime,
                class_id: data.classId ?? current.classId,
                updated_at: new Date().toISOString()
            };

            const { data: updatedPeriodData, error } = await supabase
                .from('periods')
                .update(updateData)
                .eq('id', id)
                .select('id, name, start_time, end_time, class_id')
                .single();

            if (error || !updatedPeriodData) {
                throw new Error(error?.message || 'Failed to update period');
            }

            const updatedPeriod = {
                id: updatedPeriodData.id,
                name: updatedPeriodData.name,
                startTime: updatedPeriodData.start_time,
                endTime: updatedPeriodData.end_time,
                classId: updatedPeriodData.class_id
            } as Period;

            revalidateTag('periods');
            revalidateTag(`period-${id}`);

            return updatedPeriod;
        } catch (error: any) {
            console.error('PeriodService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const { error } = await supabase
                .from('periods')
                .delete()
                .eq('id', id);

            if (error) throw error;

            revalidateTag('periods');
            revalidateTag(`period-${id}`);

            return true;
        } catch (error: any) {
            console.error('PeriodService.delete Error:', error);
            return false;
        }
    }
};

