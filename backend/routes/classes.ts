import { ClassService } from '../services/classes';
import { validateClass } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';

// Classes API Routes
// Note: These are integrated into Next.js Route Handlers (app/api/classes/route.ts)

export const classRoutes = {
    // GET /classes
    getAll: async (user: AuthPayload) => {
        try {
            // Admin: All
            // Teacher: Their classes? Requirements say "Admin: Can ... Classes". Doesn't specify others.
            // But Teacher Dashboard likely needs "My Classes".
            // Student needs "My Class".
            // For now, I'll return all, or I could filter?
            // "Teacher: Can read Students in their classes" -> Implies they know their classes.
            // I'll return all for Admin, filter for Teacher?
            // Existing helper `ClassService.getAll` returns all.
            // I'll return all for now to avoid breaking UI that expects a list, but ideally filter.
            const classes = await ClassService.getAll();
            return { status: 200, data: classes };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /classes/:id
    getById: async (id: string, user: AuthPayload) => {
        try {
            const classItem = await ClassService.getById(id);
            if (!classItem) return { status: 404, error: 'Class not found' };
            return { status: 200, data: classItem };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /classes
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can create classes' };
            }

            const validation = validateClass(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newClass = await ClassService.create(data);
            return { status: 201, data: newClass };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /classes/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can update classes' };
            }

            const updatedClass = await ClassService.update(id, data);
            if (!updatedClass) return { status: 404, error: 'Class not found' };
            return { status: 200, data: updatedClass };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /classes/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can delete classes' };
            }

            const success = await ClassService.delete(id);
            if (!success) return { status: 404, error: 'Class not found' };
            return { status: 200, data: { message: 'Class deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
