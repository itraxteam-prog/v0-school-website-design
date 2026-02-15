import { Student } from '../data/students';

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

export const validateTeacher = (data: any) => {
    // Add validation logic here
    return true;
};
