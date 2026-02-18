import { Student, Teacher, Class, Period, Role, Announcement, SchoolSettings } from '../types';

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

export const validatePeriod = (data: Partial<Period>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof Period)[] = ['name', 'startTime', 'endTime', 'classId'];

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

export const validateRole = (data: Partial<Role>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof Role)[] = ['name', 'permissions'];

    requiredFields.forEach((field) => {
        if (field === 'permissions') {
            if (!data[field] || !Array.isArray(data[field])) {
                errors.push(`${field} is required and must be an array`);
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

export const validateAnnouncement = (data: Partial<Announcement>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof Announcement)[] = ['title', 'message', 'audience'];

    requiredFields.forEach((field) => {
        if (field === 'audience') {
            if (!data[field] || !Array.isArray(data[field]) || (data[field] as any[]).length === 0) {
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

export const validateSettings = (data: Partial<SchoolSettings>): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];
    const requiredFields: (keyof SchoolSettings)[] = ['termStructure', 'schoolHours', 'maxClassesPerDay', 'defaultFeeStructure'];

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
