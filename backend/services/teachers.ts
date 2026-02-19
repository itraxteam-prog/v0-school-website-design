import { Teacher } from '../types';
import { supabase } from '../utils/supabaseClient';
import { revalidateTag } from 'next/cache';

export const TeacherService = {
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('id, name, employee_id, department, class_ids')
                .order('name', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                employeeId: item.employee_id,
                department: item.department,
                classIds: item.class_ids
            })) as Teacher[];
        } catch (error: any) {
            console.error('TeacherService.getAll Error:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('id, name, employee_id, department, class_ids')
                .eq('id', id)
                .single();

            if (error) return null;

            return {
                id: data.id,
                name: data.name,
                employeeId: data.employee_id,
                department: data.department,
                classIds: data.class_ids
            } as Teacher;
        } catch (error: any) {
            console.error('TeacherService.getById Error:', error);
            throw error;
        }
    },

    create: async (data: Omit<Teacher, 'id'>) => {
        try {
            console.log('TeacherService.create - Data received:', data);
            const id = `tch-${Math.random().toString(36).substr(2, 9)}`;

            const { data: newTeacherData, error } = await supabase
                .from('teachers')
                .insert({
                    id,
                    name: data.name,
                    employee_id: data.employeeId,
                    department: data.department,
                    class_ids: data.classIds || []
                })
                .select('id, name, employee_id, department, class_ids')
                .single();

            if (error || !newTeacherData) {
                throw new Error(error?.message || 'Failed to insert teacher');
            }

            const newTeacher = {
                id: newTeacherData.id,
                name: newTeacherData.name,
                employeeId: newTeacherData.employee_id,
                department: newTeacherData.department,
                classIds: newTeacherData.class_ids
            } as Teacher;

            console.log('TeacherService.create - Teacher created successfully:', newTeacher.id);
            revalidateTag('teachers');
            return newTeacher;
        } catch (error: any) {
            console.error('TeacherService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<Teacher>) => {
        try {
            const existing = await TeacherService.getById(id);
            if (!existing) return null;

            const updateData = {
                name: data.name ?? existing.name,
                employee_id: data.employeeId ?? existing.employeeId,
                department: data.department ?? existing.department,
                class_ids: data.classIds ?? existing.classIds,
                updated_at: new Date().toISOString()
            };

            const { data: updatedTeacherData, error } = await supabase
                .from('teachers')
                .update(updateData)
                .eq('id', id)
                .select('id, name, employee_id, department, class_ids')
                .single();

            if (error || !updatedTeacherData) {
                throw new Error(error?.message || 'Failed to update teacher');
            }

            const updatedTeacher = {
                id: updatedTeacherData.id,
                name: updatedTeacherData.name,
                employeeId: updatedTeacherData.employee_id,
                department: updatedTeacherData.department,
                classIds: updatedTeacherData.class_ids
            } as Teacher;

            revalidateTag('teachers');
            revalidateTag(`teacher-${id}`);

            return updatedTeacher;
        } catch (error: any) {
            console.error('TeacherService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const { error } = await supabase
                .from('teachers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            revalidateTag('teachers');
            revalidateTag(`teacher-${id}`);

            return true;
        } catch (error: any) {
            console.error('TeacherService.delete Error:', error);
            return false;
        }
    }
};

