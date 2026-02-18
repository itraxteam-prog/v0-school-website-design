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
        // NewAdmin@2025!
        password: '$2b$10$EkHUhS9ZKceTJedSteTYeOAwOliIy9mH7vPxsWU6e92OeURkPZPzy',
        role: 'admin',
        failed_login_attempts: 0,
        lock_until: null,
        two_factor_enabled: false
    },
    {
        id: 'u-teacher-1',
        email: 'teacher@school.com',
        name: 'Mr. Usman Sheikh',
        // NewTeacher@2025!
        password: '$2b$10$0d8uO0zcMsG3NT2Q3bkkEetR0033HCJ2VlfBOarIiBVChVEQM2pv6',
        role: 'teacher',
        failed_login_attempts: 0,
        lock_until: null,
        two_factor_enabled: false
    },
    {
        id: 'u-student-1',
        email: 'student@school.com',
        name: 'Ahmed Khan',
        // NewStudent@2025!
        password: '$2b$10$/kcXRpCMzgThHIqyIsc5seYWYp8PdkPnK3lEbbZ4byx26wxGiWLCq',
        role: 'student',
        failed_login_attempts: 0,
        lock_until: null,
        two_factor_enabled: false
    }
];
