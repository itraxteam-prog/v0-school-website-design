import { z } from 'zod';
import xss from 'xss';

// Helper for XSS sanitization
export const sanitize = (val: string) => xss(val);

// Shared patterns
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const UserSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    name: z.string().min(2, 'Name must be at least 2 characters').transform(sanitize),
    role: z.enum(['admin', 'teacher', 'student', 'parent']).optional(),
});

export const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const EmailOnlySchema = z.object({
    email: z.string().email('Invalid email format'),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const TwoFactorSchema = z.object({
    tempToken: z.string().min(1, 'Session token is required'),
    code: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const StudentSchema = z.object({
    name: z.string().min(2, 'Name is required').transform(sanitize),
    rollNo: z.string().min(1, 'Roll number is required').transform(sanitize),
    classId: z.string().uuid('Invalid class ID').or(z.string().min(1)), // Support both UUID and legacy IDs
    dob: z.string().min(1, 'Date of birth is required'),
    guardianPhone: z.string().min(10, 'Valid guardian phone is required').transform(sanitize),
});

export const TeacherSchema = z.object({
    name: z.string().min(2, 'Name is required').transform(sanitize),
    employeeId: z.string().min(1, 'Employee ID is required').transform(sanitize),
    department: z.string().min(1, 'Department is required').transform(sanitize),
    classIds: z.array(z.string()).min(1, 'At least one class assignment is required'),
});

export const ClassSchema = z.object({
    name: z.string().min(1, 'Class name is required').transform(sanitize),
    classTeacherId: z.string().min(1, 'Class teacher is required'),
    roomNo: z.string().min(1, 'Room number is required').transform(sanitize),
});

export const AnnouncementSchema = z.object({
    title: z.string().min(1, 'Title is required').transform(sanitize),
    message: z.string().min(1, 'Message is required').transform(sanitize),
    audience: z.array(z.enum(['student', 'teacher', 'admin', 'parent', 'all'])).min(1, 'At least one audience is required'),
});

export const SettingsSchema = z.object({
    termStructure: z.array(z.any()).optional(),
    schoolHours: z.object({
        start: z.string(),
        end: z.string()
    }).optional(),
    maxClassesPerDay: z.number().min(1).optional(),
    defaultFeeStructure: z.array(z.any()).optional(),
    academicYear: z.string().optional()
});

// Generic validation wrapper
export async function validateBody<T>(schema: z.Schema<T>, body: any): Promise<{ data?: T; error?: string; status: number }> {
    try {
        const validatedData = await schema.parseAsync(body);
        return { data: validatedData, status: 200 };
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const firstError = err.errors[0];
            const message = `${firstError.path.join('.')}: ${firstError.message}`;
            return { error: message, status: 400 };
        }
        return { error: 'Invalid request data', status: 400 };
    }
}
