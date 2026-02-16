import { AnnouncementService } from '../services/announcements';
import { validateAnnouncement } from '../utils/validation';

// Announcements API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/announcements/route.ts)

export const announcementRoutes = {
    // GET /announcements
    getAll: async () => {
        try {
            const announcements = await AnnouncementService.getAll();
            return { status: 200, data: announcements };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /announcements/:id
    getById: async (id: string) => {
        try {
            const announcement = await AnnouncementService.getById(id);
            if (!announcement) return { status: 404, error: 'Announcement not found' };
            return { status: 200, data: announcement };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /announcements
    create: async (data: any) => {
        try {
            const validation = validateAnnouncement(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newAnnouncement = await AnnouncementService.create(data);
            return { status: 201, data: newAnnouncement };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /announcements/:id
    update: async (id: string, data: any) => {
        try {
            const updatedAnnouncement = await AnnouncementService.update(id, data);
            if (!updatedAnnouncement) return { status: 404, error: 'Announcement not found' };
            return { status: 200, data: updatedAnnouncement };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /announcements/:id
    delete: async (id: string) => {
        try {
            const success = await AnnouncementService.delete(id);
            if (!success) return { status: 404, error: 'Announcement not found' };
            return { status: 200, data: { message: 'Announcement deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
