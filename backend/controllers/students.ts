import { StudentService } from '../services/students';
import { validateStudent } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export const studentController = {
    // GET /students - RBAC Enforced
    getAll: async (user: AuthPayload) => {
        try {
            // Logging reads at the list level might be too noisy if done here. 
            // The route handler already logs 'READ_LIST'.
            if (user.role === 'admin') {
                const students = await StudentService.getAll();
                return { status: 200, data: students };
            } else if (user.role === 'teacher') {
                const students = await StudentService.getByTeacherId(user.id);
                return { status: 200, data: students };
            } else if (user.role === 'student') {
                const student = await StudentService.getById(user.id);
                return { status: 200, data: student ? [student] : [] };
            } else {
                LogService.logAction(user.id, user.role, 'ACCESS_DENIED', 'STUDENT', undefined, 'failure', { method: 'getAll' });
                return { status: 403, error: 'Forbidden' };
            }
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'StudentController.getAll');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /students/:id - RBAC Enforced
    getById: async (id: string, user: AuthPayload) => {
        try {
            let allowed = false;

            if (user.role === 'admin') {
                allowed = true;
            } else if (user.role === 'student') {
                allowed = (user.id === id);
            } else if (user.role === 'teacher') {
                allowed = await StudentService.isStudentInTeacherClass(user.id, id);
            } else {
                // If any other role, or logic failure
                allowed = (user.id === id); // Fallback: can view self
            }

            if (!allowed) {
                LogService.logAction(user.id, user.role, 'ACCESS_DENIED', 'STUDENT', id, 'failure', { method: 'getById' });
                return { status: 403, error: 'Forbidden: Access denied' };
            }

            const student = await StudentService.getById(id);
            if (!student) return { status: 404, error: 'Student not found' };
            return { status: 200, data: student };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'StudentController.getById');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /students
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'CREATE_ATTEMPT', 'STUDENT', undefined, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can create students' };
            }

            const validation = validateStudent(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newStudent = await StudentService.create(data);

            // Log successful creation - duplicate of route handler log? 
            // The route handler logs success. Doing it here ensures business logic logging.
            // But we should pick ONE place to avoid duplicates in DB.
            // The user requested "Update all /Controller/* API handlers to write logs".
            // So we write logs here. We should REMOVE logs from app/api/* handlers later or accept duplicates.
            // Given constraints, I will add it here as requested.
            LogService.logAction(user.id, user.role, 'CREATED_STUDENT', 'STUDENT', (newStudent as any).id, 'success');

            return { status: 201, data: newStudent };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'StudentController.create');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /students/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'UPDATE_ATTEMPT', 'STUDENT', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can update students' };
            }

            const updatedStudent = await StudentService.update(id, data);
            if (!updatedStudent) return { status: 404, error: 'Student not found' };

            LogService.logAction(user.id, user.role, 'UPDATED_STUDENT', 'STUDENT', id, 'success');

            return { status: 200, data: updatedStudent };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'StudentController.update');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /students/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'DELETE_ATTEMPT', 'STUDENT', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can delete students' };
            }

            const success = await StudentService.delete(id);
            if (!success) return { status: 404, error: 'Student not found' };

            LogService.logAction(user.id, user.role, 'DELETED_STUDENT', 'STUDENT', id, 'success');

            return { status: 200, data: { message: 'Student deleted successfully' } };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'StudentController.delete');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
