import { Class, classes } from '../data/classes';

// Class Service Logic
// In-memory array to simulate database for now
let classList = [...classes];

export const ClassService = {
    getAll: () => {
        return classList;
    },

    getById: (id: string) => {
        return classList.find(c => c.id === id);
    },

    create: (data: Omit<Class, 'id'>) => {
        const newClass: Class = {
            ...data,
            id: `cls-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            studentIds: data.studentIds || []
        };
        classList.push(newClass);
        return newClass;
    },

    update: (id: string, data: Partial<Class>) => {
        const index = classList.findIndex(c => c.id === id);
        if (index === -1) return null;

        classList[index] = { ...classList[index], ...data };
        return classList[index];
    },

    delete: (id: string) => {
        const index = classList.findIndex(c => c.id === id);
        if (index === -1) return false;

        classList.splice(index, 1);
        return true;
    }
};
