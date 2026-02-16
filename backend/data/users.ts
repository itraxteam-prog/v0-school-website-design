export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    failed_login_attempts: number;
    lock_until: string | null;
    two_factor_enabled: boolean;
    two_factor_secret?: string;
    recovery_codes?: string[];
}

export const users: User[] = [
    {
        id: 'u-admin-1',
        email: 'admin@school.com',
        name: 'Dr. Ahmad Raza',
        // password123 hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$8LzLLtOlFnrhhB5jxeMxhO3VVTr9de0cSKziDXopNSJaJx4g/1Bza',
        role: 'admin',
        failedLoginAttempts: 0,
        lockUntil: null
    },
    {
        id: 'u-teacher-1',
        email: 'teacher@school.com',
        name: 'Mr. Usman Sheikh',
        // password123 hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$8LzLLtOlFnrhhB5jxeMxhO3VVTr9de0cSKziDXopNSJaJx4g/1Bza',
        role: 'teacher',
        failedLoginAttempts: 0,
        lockUntil: null
    },
    {
        id: 'u-student-1',
        email: 'student@school.com',
        name: 'Ahmed Khan',
        // password123 hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$8LzLLtOlFnrhhB5jxeMxhO3VVTr9de0cSKziDXopNSJaJx4g/1Bza',
        role: 'student',
        failedLoginAttempts: 0,
        lockUntil: null
    }
];
