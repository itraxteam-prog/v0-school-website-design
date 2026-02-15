import { Announcement, announcements } from '../data/announcements';

// Announcement Service Logic
// In-memory array to simulate database for now
let announcementList = [...announcements];

export const AnnouncementService = {
    getAll: () => {
        return announcementList;
    },

    getById: (id: string) => {
        return announcementList.find(a => a.id === id);
    },

    create: (data: Omit<Announcement, 'id' | 'createdAt'>) => {
        const newAnnouncement: Announcement = {
            ...data,
            id: `ann-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            createdAt: new Date().toISOString()
        };
        announcementList.push(newAnnouncement);
        return newAnnouncement;
    },

    update: (id: string, data: Partial<Announcement>) => {
        const index = announcementList.findIndex(a => a.id === id);
        if (index === -1) return null;

        announcementList[index] = { ...announcementList[index], ...data };
        return announcementList[index];
    },

    delete: (id: string) => {
        const index = announcementList.findIndex(a => a.id === id);
        if (index === -1) return false;

        announcementList.splice(index, 1);
        return true;
    }
};
