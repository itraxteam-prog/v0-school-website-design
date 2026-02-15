import { Student, students } from '../data/students';

// Student Service Logic
// In-memory array to simulate database for now
let studentList = [...students];

export const StudentService = {
    getAll: () => {
        return studentList;
    },

    getById: (id: string) => {
        return studentList.find(s => s.id === id);
    },

    create: (data: Omit<Student, 'id'>) => {
        const newStudent: Student = {
            ...data,
            id: `std-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        studentList.push(newStudent);
        return newStudent;
    },

    update: (id: string, data: Partial<Student>) => {
        const index = studentList.findIndex(s => s.id === id);
        if (index === -1) return null;

        studentList[index] = { ...studentList[index], ...data };
        return studentList[index];
    },

    delete: (id: string) => {
        const index = studentList.findIndex(s => s.id === id);
        if (index === -1) return false;

        studentList.splice(index, 1);
        return true;
    }
};
