import { TeacherService } from '../services/teachers';
import { validateTeacher } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export const teacherController = {
    // GET /teachers - Authenticated Users
    getAll: async (user: AuthPayload) => {
        try {
            const teachers = await TeacherService.getAll();
            return { status: 200, data: teachers };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'TeacherController.getAll');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /teachers/:id
    getById: async (id: string, user: AuthPayload) => {
        try {
            const teacher = await TeacherService.getById(id);
            if (!teacher) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: teacher };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'TeacherController.getById');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /teachers
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'CREATE_ATTEMPT', 'TEACHER', undefined, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can create teachers' };
            }

            const validation = validateTeacher(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newTeacher = await TeacherService.create(data);

            LogService.logAction(user.id, user.role, 'CREATED_TEACHER', 'TEACHER', (newTeacher as any).id, 'success');

            return { status: 201, data: newTeacher };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'TeacherController.create');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /teachers/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'UPDATE_ATTEMPT', 'TEACHER', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can update teachers' };
            }

            const updatedTeacher = await TeacherService.update(id, data);
            if (!updatedTeacher) return { status: 404, error: 'Teacher not found' };

            LogService.logAction(user.id, user.role, 'UPDATED_TEACHER', 'TEACHER', id, 'success');

            return { status: 200, data: updatedTeacher };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'TeacherController.update');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /teachers/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'DELETE_ATTEMPT', 'TEACHER', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can delete teachers' };
            }

            const success = await TeacherService.delete(id);
            if (!success) return { status: 404, error: 'Teacher not found' };

            LogService.logAction(user.id, user.role, 'DELETED_TEACHER', 'TEACHER', id, 'success');

            return { status: 200, data: { message: 'Teacher deleted successfully' } };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'TeacherController.delete');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
