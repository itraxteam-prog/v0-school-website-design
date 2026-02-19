import { Student } from '../types';
import { supabase } from '../utils/supabaseClient';
import { revalidateTag } from 'next/cache';

export const StudentService = {
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id, name, roll_no, class_id, dob, guardian_phone, address')
                .order('name', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                rollNo: item.roll_no,
                classId: item.class_id,
                dob: item.dob,
                guardianPhone: item.guardian_phone,
                address: item.address
            })) as Student[];
        } catch (error: any) {
            console.error('StudentService.getAll Error:', error);
            throw error;
        }
    },

    getByTeacherId: async (teacherId: string) => {
        try {
            // Get students in classes taught by this teacher
            const { data, error } = await supabase
                .from('students')
                .select('id, name, roll_no, class_id, dob, guardian_phone, address, classes!inner(class_teacher_id)')
                .eq('classes.class_teacher_id', teacherId)
                .order('name', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                rollNo: item.roll_no,
                classId: item.class_id,
                dob: item.dob,
                guardianPhone: item.guardian_phone,
                address: item.address
            })) as Student[];
        } catch (error: any) {
            console.error('StudentService.getByTeacherId Error:', error);
            return [];
        }
    },

    getByClassId: async (classId: string) => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id, name, roll_no, class_id, dob, guardian_phone, address')
                .eq('class_id', classId)
                .order('name', { ascending: true });

            if (error) throw error;

            return data.map(item => ({
                id: item.id,
                name: item.name,
                rollNo: item.roll_no,
                classId: item.class_id,
                dob: item.dob,
                guardianPhone: item.guardian_phone,
                address: item.address
            })) as Student[];
        } catch (error: any) {
            console.error('StudentService.getByClassId Error:', error);
            return [];
        }
    },

    isStudentInTeacherClass: async (teacherId: string, studentId: string) => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id, classes!inner(class_teacher_id)')
                .eq('id', studentId)
                .eq('classes.class_teacher_id', teacherId);

            if (error) return false;
            return data.length > 0;
        } catch (error: any) {
            console.error('StudentService.isStudentInTeacherClass Error:', error);
            return false;
        }
    },

    getById: async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id, name, roll_no, class_id, dob, guardian_phone, address')
                .eq('id', id)
                .single();

            if (error) return null;

            return {
                id: data.id,
                name: data.name,
                rollNo: data.roll_no,
                classId: data.class_id,
                dob: data.dob,
                guardianPhone: data.guardian_phone,
                address: data.address
            } as Student;
        } catch (error: any) {
            console.error('StudentService.getById Error:', error);
            throw error;
        }
    },

    create: async (data: Omit<Student, 'id'>) => {
        try {
            console.log('StudentService.create - Data received:', data);
            const id = `std-${Math.random().toString(36).substr(2, 9)}`;

            const { data: newStudentData, error } = await supabase
                .from('students')
                .insert({
                    id,
                    name: data.name,
                    roll_no: data.rollNo,
                    class_id: data.classId,
                    dob: data.dob,
                    guardian_phone: data.guardianPhone,
                    address: data.address
                })
                .select('id, name, roll_no, class_id, dob, guardian_phone, address')
                .single();

            if (error || !newStudentData) {
                throw new Error(error?.message || 'Failed to insert student');
            }

            const newStudent = {
                id: newStudentData.id,
                name: newStudentData.name,
                rollNo: newStudentData.roll_no,
                classId: newStudentData.class_id,
                dob: newStudentData.dob,
                guardianPhone: newStudentData.guardian_phone,
                address: newStudentData.address
            } as Student;

            console.log('StudentService.create - Student created successfully:', newStudent.id);
            revalidateTag('students');
            return newStudent;
        } catch (error: any) {
            console.error('StudentService.create Error:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<Student>) => {
        try {
            const existing = await StudentService.getById(id);
            if (!existing) return null;

            const updateData = {
                name: data.name ?? existing.name,
                roll_no: data.rollNo ?? existing.rollNo,
                class_id: data.classId ?? existing.classId,
                dob: data.dob ?? existing.dob,
                guardian_phone: data.guardianPhone ?? existing.guardianPhone,
                address: data.address ?? existing.address,
                updated_at: new Date().toISOString()
            };

            const { data: updatedStudentData, error } = await supabase
                .from('students')
                .update(updateData)
                .eq('id', id)
                .select('id, name, roll_no, class_id, dob, guardian_phone, address')
                .single();

            if (error || !updatedStudentData) {
                throw new Error(error?.message || 'Failed to update student');
            }

            const updatedStudent = {
                id: updatedStudentData.id,
                name: updatedStudentData.name,
                rollNo: updatedStudentData.roll_no,
                classId: updatedStudentData.class_id,
                dob: updatedStudentData.dob,
                guardianPhone: updatedStudentData.guardian_phone,
                address: updatedStudentData.address
            } as Student;

            revalidateTag('students');
            revalidateTag(`student-${id}`);

            return updatedStudent;
        } catch (error: any) {
            console.error('StudentService.update Error:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const { error } = await supabase
                .from('students')
                .delete()
                .eq('id', id);

            if (error) throw error;

            revalidateTag('students');
            revalidateTag(`student-${id}`);

            return true;
        } catch (error: any) {
            console.error('StudentService.delete Error:', error);
            return false;
        }
    }
};

