import { Student } from '../data/students';
import { Teacher } from '../data/teachers';
import { Class } from '../data/classes';

// Validation Utility Functions

export const validateStudent = (data: Partial<Student>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof Student)[] = ['name', 'rollNo', 'classId', 'dob', 'guardianPhone'];

    requiredFields.forEach((field) => {
        if (!data[field]) {
            errors.push(`${field} is required`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
};

export const validateTeacher = (data: Partial<Teacher>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof Teacher)[] = ['name', 'employeeId', 'department', 'classIds'];

    requiredFields.forEach((field) => {
        if (field === 'classIds') {
            if (!data[field] || !Array.isArray(data[field]) || data[field].length === 0) {
                errors.push(`${field} is required and must be a non-empty array`);
            }
        } else if (!data[field]) {
            errors.push(`${field} is required`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
};

export const validateClass = (data: Partial<Class>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof Class)[] = ['name', 'classTeacherId', 'roomNo'];

    requiredFields.forEach((field) => {
        if (!data[field]) {
            errors.push(`${field} is required`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
};
