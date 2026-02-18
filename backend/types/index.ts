export interface Announcement {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    audience: ("student" | "teacher" | "all")[];
}

export interface Class {
    id: string;
    name: string;
    classTeacherId: string;
    roomNo: string;
    studentIds: string[];
}

export interface Period {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    classId: string;
}

export interface Role {
    id: string;
    name: 'admin' | 'teacher' | 'student';
    permissions: string[];
}

export interface SchoolSettings {
    schoolName: string;
    schoolCode: string;
    address: string;
    contactNumber: string;
    email: string;
    termStructure: string;
    gradingSystem: string;
    promotionThreshold: number;
    schoolHours: {
        startTime: string;
        endTime: string;
    };
    maxClassesPerDay: number;
    defaultFeeStructure: {
        [grade: string]: number;
    };
    portalPreferences: {
        darkMode: boolean;
        language: string;
        timezone: string;
        smsNotifications: boolean;
        emailNotifications: boolean;
    };
}

export interface Student {
    id: string;
    name: string;
    rollNo: string;
    classId: string;
    dob: string;
    guardianPhone: string;
    address: string;
}

export interface Teacher {
    id: string;
    name: string;
    employeeId: string;
    classIds: string[];
    department: string;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    status?: string;
    failed_login_attempts?: number;
    lock_until?: string | null;
    two_factor_enabled?: boolean;
    two_factor_secret?: string;
    recovery_codes?: string[];
    last_login?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthPayload {
    id: string;
    email: string;
    role: string;
    name?: string;
}
