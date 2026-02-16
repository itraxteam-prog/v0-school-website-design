export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
}

export const users: User[] = [
    {
        id: 'u-admin-1',
        email: 'admin@school.com',
        name: 'Dr. Ahmad Raza',
        // password123 hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$8LzLLtOlFnrhhB5jxeMxhO3VVTr9de0cSKziDXopNSJaJx4g/1Bza',
        role: 'admin'
    },
    {
        id: 'u-teacher-1',
        email: 'teacher@school.com',
        name: 'Mr. Usman Sheikh',
        // password123 hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$8LzLLtOlFnrhhB5jxeMxhO3VVTr9de0cSKziDXopNSJaJx4g/1Bza',
        role: 'teacher'
    },
    {
        id: 'u-student-1',
        email: 'student@school.com',
        name: 'Ahmed Khan',
        // password123 hashed with bcrypt (saltRounds: 10)
        password: '$2b$10$8LzLLtOlFnrhhB5jxeMxhO3VVTr9de0cSKziDXopNSJaJx4g/1Bza',
        role: 'student'
    }
];
