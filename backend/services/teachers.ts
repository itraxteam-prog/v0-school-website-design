import { Teacher } from '../types';
import { sql } from '../utils/db';
import { revalidateTag } from 'next/cache';

export const TeacherService = {
    getAll: async () => {
        try {
            const result = await sql`
                SELECT id, name, employee_id as "employeeId", department, class_ids as "classIds" 
                FROM public.teachers 
                ORDER BY name ASC
            `;
            return result as unknown as Teacher[];
        } catch (error: any) {
            console.error('TeacherService.getAll Error:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const result = await sql`
                SELECT id, name, employee_id as "employeeId", department, class_ids as "classIds" 
                FROM public.teachers 
                WHERE id = ${id}
            `;
            return result.length > 0 ? (result[0] as unknown as Teacher) : null;
        } catch (error: any) {
            console.error('TeacherService.getById Error:', error);
            throw error;
        }
    },

    create: async (data: Omit<Teacher, 'id'>) => {
        try {
            console.log('TeacherService.create - Data received:', data);
            const id = `tch-${Math.random().toString(36).substr(2, 9)}`;

            const result = await sql`
                INSERT INTO public.teachers (
                    id, name, employee_id, department, class_ids
                ) VALUES (
                    ${id}, ${data.name}, ${data.employeeId}, ${data.department}, ${data.classIds || []}
                ) RETURNING id, name, employee_id as "employeeId", department, class_ids as "classIds"
            `;

            if (!result || result.length === 0) {
                throw new Error('Failed to insert teacher');
            }

            console.log('TeacherService.create - Teacher created successfully:', result[0].id);
            revalidateTag('teachers');
            return result[0] as unknown as Teacher;
        } catch (error: any) {
            console.error('TeacherService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<Teacher>) => {
        try {
            const existing = await TeacherService.getById(id);
            if (!existing) return null;

            const updateData = { ...existing, ...data };

            const result = await sql`
                UPDATE public.teachers SET
                    name = ${updateData.name},
                    employee_id = ${updateData.employeeId},
                    department = ${updateData.department},
                    class_ids = ${updateData.classIds || []},
                    updated_at = NOW()
                WHERE id = ${id}
                RETURNING id, name, employee_id as "employeeId", department, class_ids as "classIds"
            `;

            revalidateTag('teachers');
            revalidateTag(`teacher-${id}`);

            return result[0] as unknown as Teacher;
        } catch (error: any) {
            console.error('TeacherService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const result = await sql`
                DELETE FROM public.teachers WHERE id = ${id}
            `;

            revalidateTag('teachers');
            revalidateTag(`teacher-${id}`);

            return true;
        } catch (error: any) {
            console.error('TeacherService.delete Error:', error);
            return false;
        }
    }
};

