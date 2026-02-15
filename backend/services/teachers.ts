import { Teacher, teachers } from '../data/teachers';

// Teacher Service Logic
// In-memory array to simulate database for now
let teacherList = [...teachers];

export const TeacherService = {
    getAll: () => {
        return teacherList;
    },

    getById: (id: string) => {
        return teacherList.find(t => t.id === id);
    },

    create: (data: Omit<Teacher, 'id'>) => {
        const newTeacher: Teacher = {
            ...data,
            id: `tch-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        teacherList.push(newTeacher);
        return newTeacher;
    },

    update: (id: string, data: Partial<Teacher>) => {
        const index = teacherList.findIndex(t => t.id === id);
        if (index === -1) return null;

        teacherList[index] = { ...teacherList[index], ...data };
        return teacherList[index];
    },

    delete: (id: string) => {
        const index = teacherList.findIndex(t => t.id === id);
        if (index === -1) return false;

        teacherList.splice(index, 1);
        return true;
    }
};
