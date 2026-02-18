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

// Alias for registration
export const RegisterSchema = UserSchema;

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
    address: z.string().min(5, 'Address must be at least 5 characters').transform(sanitize),
});

export const TeacherSchema = z.object({
    name: z.string().min(2, 'Name is required').transform(sanitize),
    employeeId: z.string().min(1, 'Employee ID is required').transform(sanitize),
    department: z.string().min(1, 'Department is required').transform(sanitize),
    classIds: z.union([
        z.array(z.string()),
        z.string().transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean))
    ]).refine((arr) => Array.isArray(arr) && arr.length >= 1, 'At least one class assignment is required'),
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
    schoolName: z.string().min(1, 'School name is required').transform(sanitize).optional(),
    schoolCode: z.string().min(1, 'School code is required').transform(sanitize).optional(),
    address: z.string().min(1, 'Address is required').transform(sanitize).optional(),
    contactNumber: z.string().min(1, 'Contact number is required').transform(sanitize).optional(),
    email: z.string().email('Invalid email format').optional(),
    termStructure: z.string().optional(),
    gradingSystem: z.string().optional(),
    promotionThreshold: z.number().min(0).max(100).optional(),
    schoolHours: z.object({
        startTime: z.string(),
        endTime: z.string()
    }).optional(),
    maxClassesPerDay: z.number().min(1).optional(),
    academicYear: z.string().optional(),
    portalPreferences: z.object({
        darkMode: z.boolean(),
        language: z.string(),
        timezone: z.string(),
        smsNotifications: z.boolean(),
        emailNotifications: z.boolean(),
    }).optional()
});

export const AttendanceSchema = z.object({
    classId: z.string().min(1, 'Class ID is required'),
    date: z.string().min(1, 'Date is required'),
    records: z.array(z.object({
        studentId: z.string().min(1, 'Student ID is required'),
        status: z.enum(['present', 'absent', 'late', 'excused']),
        remarks: z.string().optional()
    })).min(1, 'At least one attendance record is required')
});

export const AcademicRecordSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    subjectId: z.string().min(1, 'Subject ID is required'),
    term: z.string().min(1, 'Term is required').transform(sanitize),
    marksObtained: z.number().min(0, 'Marks cannot be negative'),
    totalMarks: z.number().min(1, 'Total marks must be positive'),
    grade: z.string().min(1, 'Grade is required').transform(sanitize),
    examDate: z.string().min(1, 'Exam date is required'),
    remarks: z.string().optional().transform((val) => val ? sanitize(val) : val)
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
