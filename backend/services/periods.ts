import { Period } from '../data/periods';
import { sql } from '../utils/db';
import { NotificationService } from './notificationService';
import { revalidateTag } from 'next/cache';

export const PeriodService = {
    getAll: async () => {
        try {
            const result = await sql`
                SELECT id, name, start_time as "startTime", end_time as "endTime", class_id as "classId" 
                FROM public.periods 
                ORDER BY start_time ASC
            `;
            return result as unknown as Period[];
        } catch (error: any) {
            console.error('PeriodService.getAll Error:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const result = await sql`
                SELECT id, name, start_time as "startTime", end_time as "endTime", class_id as "classId" 
                FROM public.periods 
                WHERE id = ${id}
            `;
            return result.length > 0 ? (result[0] as unknown as Period) : null;
        } catch (error: any) {
            console.error('PeriodService.getById Error:', error);
            throw error;
        }
    },

    getByClassIds: async (classIds: string[]) => {
        try {
            if (!classIds.length) return [];
            const result = await sql`
                SELECT id, name, start_time as "startTime", end_time as "endTime", class_id as "classId" 
                FROM public.periods 
                WHERE class_id IN ${sql(classIds)}
                ORDER BY start_time ASC
            `;
            return result as unknown as Period[];
        } catch (error: any) {
            console.error('PeriodService.getByClassIds Error:', error);
            return [];
        }
    },

    create: async (data: Omit<Period, 'id'>) => {
        try {
            console.log('PeriodService.create - Data received:', data);
            const id = `prd-${Math.random().toString(36).substr(2, 9)}`;

            const result = await sql`
                INSERT INTO public.periods (
                    id, name, start_time, end_time, class_id
                ) VALUES (
                    ${id}, ${data.name}, ${data.startTime}, ${data.endTime}, ${data.classId}
                ) RETURNING id, name, start_time as "startTime", end_time as "endTime", class_id as "classId"
            `;

            if (!result || result.length === 0) {
                throw new Error('Failed to insert period');
            }

            const newPeriod = result[0];
            console.log('PeriodService.create - Period created successfully:', newPeriod.id);
            revalidateTag('periods');

            // Notify about schedule change (Generic notify for now)
            try {
                // Background notify
                (async () => {
                    const users = await sql`SELECT id, role FROM public.users WHERE role IN ('teacher', 'student')`;
                    for (const user of users) {
                        NotificationService.sendEmailNotification(
                            user.id,
                            'SCHEDULE_CHANGE',
                            `A new class period has been added: ${data.name} (${data.startTime} - ${data.endTime})`,
                            user.role
                        );
                    }
                })();
            } catch (notifyError) {
                console.error('Failed to send period notifications:', notifyError);
            }

            return newPeriod as unknown as Period;
        } catch (error: any) {
            console.error('PeriodService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<Period>) => {
        try {
            const current = await PeriodService.getById(id);
            if (!current) return null;

            const updateData = { ...current, ...data };

            const result = await sql`
                UPDATE public.periods SET
                    name = ${updateData.name},
                    start_time = ${updateData.startTime},
                    end_time = ${updateData.endTime},
                    class_id = ${updateData.classId},
                    updated_at = NOW()
                WHERE id = ${id}
                RETURNING id, name, start_time as "startTime", end_time as "endTime", class_id as "classId"
            `;

            const updatedPeriod = result[0];
            revalidateTag('periods');
            revalidateTag(`period-${id}`);

            return updatedPeriod as unknown as Period;
        } catch (error: any) {
            console.error('PeriodService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await sql`DELETE FROM public.periods WHERE id = ${id}`;

            revalidateTag('periods');
            revalidateTag(`period-${id}`);

            return true;
        } catch (error: any) {
            console.error('PeriodService.delete Error:', error);
            return false;
        }
    }
};

