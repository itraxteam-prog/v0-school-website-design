import { Period, periods } from '../data/periods';

// Period Service Logic
// In-memory array to simulate database for now
let periodList = [...periods];

export const PeriodService = {
    getAll: () => {
        return periodList;
    },

    getById: (id: string) => {
        return periodList.find(p => p.id === id);
    },

    create: (data: Omit<Period, 'id'>) => {
        const newPeriod: Period = {
            ...data,
            id: `prd-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        periodList.push(newPeriod);
        return newPeriod;
    },

    update: (id: string, data: Partial<Period>) => {
        const index = periodList.findIndex(p => p.id === id);
        if (index === -1) return null;

        periodList[index] = { ...periodList[index], ...data };
        return periodList[index];
    },

    delete: (id: string) => {
        const index = periodList.findIndex(p => p.id === id);
        if (index === -1) return false;

        periodList.splice(index, 1);
        return true;
    }
};
