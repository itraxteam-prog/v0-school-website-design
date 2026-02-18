import { Student } from '../types';
import { sql } from '../utils/db';
import { revalidateTag } from 'next/cache';

export const StudentService = {
    getAll: async () => {
        try {
            const result = await sql`
                SELECT id, name, roll_no as "rollNo", class_id as "classId", dob, guardian_phone as "guardianPhone", address 
                FROM public.students 
                ORDER BY name ASC
            `;
            return result as unknown as Student[];
        } catch (error: any) {
            console.error('StudentService.getAll Error:', error);
            throw error;
        }
    },

    getByTeacherId: async (teacherId: string) => {
        try {
            // Get students in classes taught by this teacher
            const result = await sql`
                SELECT s.id, s.name, s.roll_no as "rollNo", s.class_id as "classId", s.dob, s.guardian_phone as "guardianPhone", s.address 
                FROM public.students s
                JOIN public.classes c ON s.class_id = c.id
                WHERE c.class_teacher_id = ${teacherId}
                ORDER BY s.name ASC
            `;
            return result as unknown as Student[];
        } catch (error: any) {
            console.error('StudentService.getByTeacherId Error:', error);
            return [];
        }
    },

    getByClassId: async (classId: string) => {
        try {
            const result = await sql`
                SELECT id, name, roll_no as "rollNo", class_id as "classId", dob, guardian_phone as "guardianPhone", address 
                FROM public.students 
                WHERE class_id = ${classId}
                ORDER BY name ASC
            `;
            return result as unknown as Student[];
        } catch (error: any) {
            console.error('StudentService.getByClassId Error:', error);
            return [];
        }
    },

    isStudentInTeacherClass: async (teacherId: string, studentId: string) => {
        try {
            const result = await sql`
                SELECT 1 FROM public.students s
                JOIN public.classes c ON s.class_id = c.id
                WHERE s.id = ${studentId} AND c.class_teacher_id = ${teacherId}
            `;
            return result.length > 0;
        } catch (error: any) {
            console.error('StudentService.isStudentInTeacherClass Error:', error);
            return false;
        }
    },

    getById: async (id: string) => {
        try {
            const result = await sql`
                SELECT id, name, roll_no as "rollNo", class_id as "classId", dob, guardian_phone as "guardianPhone", address 
                FROM public.students 
                WHERE id = ${id}
            `;
            return result.length > 0 ? (result[0] as unknown as Student) : null;
        } catch (error: any) {
            console.error('StudentService.getById Error:', error);
            throw error;
        }
    },

    create: async (data: Omit<Student, 'id'>) => {
        try {
            console.log('StudentService.create - Data received:', data);
            const id = `std-${Math.random().toString(36).substr(2, 9)}`;

            const result = await sql`
                INSERT INTO public.students (
                    id, name, roll_no, class_id, dob, guardian_phone, address
                ) VALUES (
                    ${id}, ${data.name}, ${data.rollNo}, ${data.classId}, ${data.dob}, ${data.guardianPhone}, ${data.address}
                ) RETURNING id, name, roll_no as "rollNo", class_id as "classId", dob, guardian_phone as "guardianPhone", address
            `;

            if (!result || result.length === 0) {
                throw new Error('Failed to insert student');
            }

            console.log('StudentService.create - Student created successfully:', result[0].id);
            revalidateTag('students');
            return result[0] as unknown as Student;
        } catch (error: any) {
            console.error('StudentService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<Student>) => {
        try {
            const existing = await StudentService.getById(id);
            if (!existing) return null;

            const updateData = { ...existing, ...data };

            const result = await sql`
                UPDATE public.students SET
                    name = ${updateData.name},
                    roll_no = ${updateData.rollNo},
                    class_id = ${updateData.classId},
                    dob = ${updateData.dob},
                    guardian_phone = ${updateData.guardianPhone},
                    address = ${updateData.address},
                    updated_at = NOW()
                WHERE id = ${id}
                RETURNING id, name, roll_no as "rollNo", class_id as "classId", dob, guardian_phone as "guardianPhone", address
            `;

            revalidateTag('students');
            revalidateTag(`student-${id}`);

            return result[0] as unknown as Student;
        } catch (error: any) {
            console.error('StudentService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const result = await sql`
                DELETE FROM public.students WHERE id = ${id}
            `;

            revalidateTag('students');
            revalidateTag(`student-${id}`);

            return true;
        } catch (error: any) {
            console.error('StudentService.delete Error:', error);
            return false;
        }
    }
};

