export interface User {
    id: string;
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
}

export const users: User[] = [
    {
        id: 'u-admin-1',
        email: 'admin@school.com',
        password: 'password123',
        role: 'admin'
    },
    {
        id: 'u-teacher-1',
        email: 'teacher@school.com',
        password: 'password123',
        role: 'teacher'
    },
    {
        id: 'u-student-1',
        email: 'student@school.com',
        password: 'password123',
        role: 'student'
    }
];
