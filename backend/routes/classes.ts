import { ClassService } from '../services/classes';
import { validateClass } from '../utils/validation';

// Classes API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/classes/route.ts)

export const classRoutes = {
    // GET /classes
    getAll: async () => {
        try {
            const classes = await ClassService.getAll();
            return { status: 200, data: classes };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /classes/:id
    getById: async (id: string) => {
        try {
            const classItem = await ClassService.getById(id);
            if (!classItem) return { status: 404, error: 'Class not found' };
            return { status: 200, data: classItem };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /classes
    create: async (data: any) => {
        try {
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
    update: async (id: string, data: any) => {
        try {
            const updatedClass = await ClassService.update(id, data);
            if (!updatedClass) return { status: 404, error: 'Class not found' };
            return { status: 200, data: updatedClass };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /classes/:id
    delete: async (id: string) => {
        try {
            const success = await ClassService.delete(id);
            if (!success) return { status: 404, error: 'Class not found' };
            return { status: 200, data: { message: 'Class deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
