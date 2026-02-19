import { Class } from '../types';
import { supabase } from '../utils/supabaseClient';
import { NotificationService } from './notificationService';
import { revalidateTag } from 'next/cache';

export const ClassService = {
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('id, name, class_teacher_id, room_no, student_ids')
                .order('name', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                classTeacherId: item.class_teacher_id,
                roomNo: item.room_no,
                studentIds: item.student_ids
            })) as Class[];
        } catch (error: any) {
            console.error('ClassService.getAll Error:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('id, name, class_teacher_id, room_no, student_ids')
                .eq('id', id)
                .single();

            if (error) return null;

            return {
                id: data.id,
                name: data.name,
                classTeacherId: data.class_teacher_id,
                roomNo: data.room_no,
                studentIds: data.student_ids
            } as Class;
        } catch (error: any) {
            console.error('ClassService.getById Error:', error);
            throw error;
        }
    },

    getByTeacherId: async (teacherId: string) => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('id, name, class_teacher_id, room_no, student_ids')
                .eq('class_teacher_id', teacherId)
                .order('name', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                classTeacherId: item.class_teacher_id,
                roomNo: item.room_no,
                studentIds: item.student_ids
            })) as Class[];
        } catch (error: any) {
            console.error('ClassService.getByTeacherId Error:', error);
            return [];
        }
    },

    create: async (data: Omit<Class, 'id'>) => {
        try {
            console.log('ClassService.create - Data received:', data);
            const id = `cls-${Math.random().toString(36).substr(2, 9)}`;

            const { data: newClassData, error } = await supabase
                .from('classes')
                .insert({
                    id,
                    name: data.name,
                    class_teacher_id: data.classTeacherId,
                    room_no: data.roomNo,
                    student_ids: data.studentIds || []
                })
                .select('id, name, class_teacher_id, room_no, student_ids')
                .single();

            if (error || !newClassData) {
                throw new Error(error?.message || 'Failed to insert class');
            }

            const newClass = {
                id: newClassData.id,
                name: newClassData.name,
                classTeacherId: newClassData.class_teacher_id,
                roomNo: newClassData.room_no,
                studentIds: newClassData.student_ids
            } as Class;

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

            return newClass;
        } catch (error: any) {
            console.error('ClassService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<any>) => {
        try {
            const current = await ClassService.getById(id);
            if (!current) return null;

            const updateData = {
                name: data.name ?? current.name,
                class_teacher_id: data.classTeacherId ?? current.classTeacherId,
                room_no: data.roomNo ?? current.roomNo,
                student_ids: data.studentIds ?? current.studentIds,
                updated_at: new Date().toISOString()
            };

            const { data: updatedClassData, error } = await supabase
                .from('classes')
                .update(updateData)
                .eq('id', id)
                .select('id, name, class_teacher_id, room_no, student_ids')
                .single();

            if (error || !updatedClassData) {
                throw new Error(error?.message || 'Failed to update class');
            }

            const updatedClass = {
                id: updatedClassData.id,
                name: updatedClassData.name,
                classTeacherId: updatedClassData.class_teacher_id,
                roomNo: updatedClassData.room_no,
                studentIds: updatedClassData.student_ids
            } as Class;

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

            return updatedClass;
        } catch (error: any) {
            console.error('ClassService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const { error } = await supabase
                .from('classes')
                .delete()
                .eq('id', id);

            if (error) throw error;

            revalidateTag('classes');
            revalidateTag(`class-${id}`);

            return true;
        } catch (error: any) {
            console.error('ClassService.delete Error:', error);
            return false;
        }
    }
};

