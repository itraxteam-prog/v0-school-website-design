import { AnnouncementService } from '../services/announcements';
import { validateAnnouncement } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export const announcementController = {
    // GET /announcements - RBAC Enforced
    getAll: async (user: AuthPayload) => {
        try {
            // Admin sees all. Others see announcements targeted to their role (e.g. 'students', 'teachers')
            const filterRole = user.role === 'admin' ? undefined : user.role;
            const announcements = await AnnouncementService.getAll(filterRole);
            return { status: 200, data: announcements };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AnnouncementController.getAll');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /announcements/:id
    getById: async (id: string, user: AuthPayload) => {
        try {
            const announcement = await AnnouncementService.getById(id);
            if (!announcement) return { status: 404, error: 'Announcement not found' };

            // Check if user is allowed to see this announcement
            if (user.role !== 'admin') {
                // Check audience. Assuming format "students", "teachers".
                const target = announcement.audience?.[0] || '';
                // If target is specific and not matching user role, deny.
                // We need to handle 'all' or multiple audiences if scheme evolves.
                // Current schema: audience is array, but usually length 1.
                // Cast user.role to match the expected type or use 'as any' for include check
                if (!announcement.audience?.includes(user.role as any) && !announcement.audience?.includes('all')) {
                    // But wait, schema stores "students" (plural) in targetAudience, and mapped to 'student' in audience array?
                    // AnnouncementService.create: `audience: [newAnnouncement.targetAudience.replace(/s$/, '')]`
                    // So DB has "students", mapped object deals with "student".
                    // If user.role is 'student', and audience includes 'student', it's fine.
                    LogService.logAction(user.id, user.role, 'ACCESS_DENIED', 'ANNOUNCEMENT', id, 'failure', { reason: 'Audience mismatch' });
                    return { status: 403, error: 'Forbidden' };
                }
            }

            return { status: 200, data: announcement };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AnnouncementController.getById');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /announcements
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'CREATE_ATTEMPT', 'ANNOUNCEMENT', undefined, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can create announcements' };
            }

            const validation = validateAnnouncement(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newAnnouncement = await AnnouncementService.create(data);

            LogService.logAction(user.id, user.role, 'CREATED_ANNOUNCEMENT', 'ANNOUNCEMENT', (newAnnouncement as any).id, 'success');

            return { status: 201, data: newAnnouncement };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AnnouncementController.create');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /announcements/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                // Requirement: "Teacher: ... update Announcements for their classes."
                // Since we don't have ownership, restrict to Admin. 
                // If we wanted to allow teachers, we'd check if audience='student'.
                LogService.logAction(user.id, user.role, 'UPDATE_ATTEMPT', 'ANNOUNCEMENT', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can update announcements' };
            }

            const updatedAnnouncement = await AnnouncementService.update(id, data);
            if (!updatedAnnouncement) return { status: 404, error: 'Announcement not found' };

            LogService.logAction(user.id, user.role, 'UPDATED_ANNOUNCEMENT', 'ANNOUNCEMENT', id, 'success');

            return { status: 200, data: updatedAnnouncement };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AnnouncementController.update');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /announcements/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'DELETE_ATTEMPT', 'ANNOUNCEMENT', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can delete announcements' };
            }
            const success = await AnnouncementService.delete(id);
            if (!success) return { status: 404, error: 'Announcement not found' };

            LogService.logAction(user.id, user.role, 'DELETED_ANNOUNCEMENT', 'ANNOUNCEMENT', id, 'success');

            return { status: 200, data: { message: 'Announcement deleted successfully' } };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AnnouncementController.delete');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
