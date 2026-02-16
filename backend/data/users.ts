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
        // Admin@2024! hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$aUXP3ilFSUwvljx7WKGODe5RSl6Ifs2uM.G30NfzsmnCuWHHwrOYm',
        role: 'admin',
        failed_login_attempts: 0,
        lock_until: null,
        two_factor_enabled: false
    },
    {
        id: 'u-teacher-1',
        email: 'teacher@school.com',
        name: 'Mr. Usman Sheikh',
        // Teacher@2024! hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$1p7fHeBWRZAx4EXBMo05iuutSO2H9wcAUN/PBb8DAsMuMVD0AG26m',
        role: 'teacher',
        failed_login_attempts: 0,
        lock_until: null,
        two_factor_enabled: false
    },
    {
        id: 'u-student-1',
        email: 'student@school.com',
        name: 'Ahmed Khan',
        // Student@2024! hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$dr44IHTfKT.HpXKfs0yOXumHHHqD.CycCoKtK5nLQS/yAPzx5/bo.',
        role: 'student',
        failed_login_attempts: 0,
        lock_until: null,
        two_factor_enabled: false
    }
];
