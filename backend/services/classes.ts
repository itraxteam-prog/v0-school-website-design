import { Class } from '../types';
import { sql } from '../utils/db';
import { NotificationService } from './notificationService';
import { revalidateTag } from 'next/cache';

export const ClassService = {
    getAll: async () => {
        try {
            const result = await sql`
                SELECT id, name, class_teacher_id as "classTeacherId", room_no as "roomNo", student_ids as "studentIds" 
                FROM public.classes 
                ORDER BY name ASC
            `;
            return result as unknown as Class[];
        } catch (error: any) {
            console.error('ClassService.getAll Error:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const result = await sql`
                SELECT id, name, class_teacher_id as "classTeacherId", room_no as "roomNo", student_ids as "studentIds" 
                FROM public.classes 
                WHERE id = ${id}
            `;
            return result.length > 0 ? (result[0] as unknown as Class) : null;
        } catch (error: any) {
            console.error('ClassService.getById Error:', error);
            throw error;
        }
    },

    getByTeacherId: async (teacherId: string) => {
        try {
            const result = await sql`
                SELECT id, name, class_teacher_id as "classTeacherId", room_no as "roomNo", student_ids as "studentIds" 
                FROM public.classes 
                WHERE class_teacher_id = ${teacherId}
                ORDER BY name ASC
            `;
            return result as unknown as Class[];
        } catch (error: any) {
            console.error('ClassService.getByTeacherId Error:', error);
            return [];
        }
    },

    create: async (data: Omit<Class, 'id'>) => {
        try {
            console.log('ClassService.create - Data received:', data);
            const id = `cls-${Math.random().toString(36).substr(2, 9)}`;

            const result = await sql`
                INSERT INTO public.classes (
                    id, name, class_teacher_id, room_no, student_ids
                ) VALUES (
                    ${id}, ${data.name}, ${data.classTeacherId}, ${data.roomNo}, ${data.studentIds || []}
                ) RETURNING id, name, class_teacher_id as "classTeacherId", room_no as "roomNo", student_ids as "studentIds"
            `;

            if (!result || result.length === 0) {
                throw new Error('Failed to insert class');
            }

            const newClass = result[0];
            console.log('ClassService.create - Class created successfully:', newClass.id);
            revalidateTag('classes');

            // Notify assigned teacher
            if (newClass.classTeacherId) {
                try {
                    NotificationService.sendEmailNotification(
                        newClass.classTeacherId,
                        'CLASS_ASSIGNED',
                        `You have been assigned as the class teacher for ${newClass.name}.`,
                        'teacher'
                    );
                } catch (notifyError) {
                    console.error('Failed to send class assignment notification:', notifyError);
                }
            }

            return newClass as unknown as Class;
        } catch (error: any) {
            console.error('ClassService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<any>) => {
        try {
            const current = await ClassService.getById(id);
            if (!current) return null;

            const updateData = { ...current, ...data };

            const result = await sql`
                UPDATE public.classes SET
                    name = ${updateData.name},
                    class_teacher_id = ${updateData.classTeacherId},
                    room_no = ${updateData.roomNo},
                    student_ids = ${updateData.studentIds || []},
                    updated_at = NOW()
                WHERE id = ${id}
                RETURNING id, name, class_teacher_id as "classTeacherId", room_no as "roomNo", student_ids as "studentIds"
            `;

            const updatedClass = result[0];
            revalidateTag('classes');
            revalidateTag(`class-${id}`);

            // If teacher changed, notify the new one
            if (data.classTeacherId && data.classTeacherId !== current?.classTeacherId) {
                try {
                    NotificationService.sendEmailNotification(
                        data.classTeacherId,
                        'CLASS_ASSIGNED_UPDATE',
                        `You have been assigned as the new class teacher for ${updatedClass.name}.`,
                        'teacher'
                    );
                } catch (notifyError) {
                    console.error('Failed to send class assignment update notification:', notifyError);
                }
            }

            return updatedClass as unknown as Class;
        } catch (error: any) {
            console.error('ClassService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await sql`DELETE FROM public.classes WHERE id = ${id}`;

            revalidateTag('classes');
            revalidateTag(`class-${id}`);

            return true;
        } catch (error: any) {
            console.error('ClassService.delete Error:', error);
            return false;
        }
    }
};

