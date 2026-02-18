import { ClassService } from '../services/classes';
import { validateClass } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export const classController = {
    // GET /classes
    getAll: async (user: AuthPayload) => {
        try {
            const classes = await ClassService.getAll();
            return { status: 200, data: classes };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'ClassController.getAll');
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
            LogService.logError(user.id, user.role, error, 'ClassController.getById');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /classes
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'CREATE_ATTEMPT', 'CLASS', undefined, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can create classes' };
            }

            const validation = validateClass(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newClass = await ClassService.create(data);

            LogService.logAction(user.id, user.role, 'CREATED_CLASS', 'CLASS', (newClass as any).id, 'success');

            return { status: 201, data: newClass };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'ClassController.create');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /classes/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'UPDATE_ATTEMPT', 'CLASS', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can update classes' };
            }

            const updatedClass = await ClassService.update(id, data);
            if (!updatedClass) return { status: 404, error: 'Class not found' };

            LogService.logAction(user.id, user.role, 'UPDATED_CLASS', 'CLASS', id, 'success');

            return { status: 200, data: updatedClass };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'ClassController.update');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /classes/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'DELETE_ATTEMPT', 'CLASS', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can delete classes' };
            }

            const success = await ClassService.delete(id);
            if (!success) return { status: 404, error: 'Class not found' };

            LogService.logAction(user.id, user.role, 'DELETED_CLASS', 'CLASS', id, 'success');

            return { status: 200, data: { message: 'Class deleted successfully' } };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'ClassController.delete');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
