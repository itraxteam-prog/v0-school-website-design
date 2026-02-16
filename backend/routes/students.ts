import { StudentService } from '../services/students';
import { validateStudent } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';

// Students API Routes
// Note: These are integrated into Next.js Route Handlers (app/api/students/route.ts)

export const studentRoutes = {
    // GET /students - RBAC Enforced
    getAll: async (user: AuthPayload) => {
        try {
            if (user.role === 'admin') {
                const students = await StudentService.getAll();
                return { status: 200, data: students };
            } else if (user.role === 'teacher') {
                const students = await StudentService.getByTeacherId(user.id);
                return { status: 200, data: students };
            } else if (user.role === 'student') {
                // Return array containing only the student themself
                const student = await StudentService.getById(user.id);
                return { status: 200, data: student ? [student] : [] };
            } else {
                return { status: 403, error: 'Forbidden' };
            }
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /students/:id - RBAC Enforced
    getById: async (id: string, user: AuthPayload) => {
        try {
            // Permission Check
            let allowed = false;

            if (user.role === 'admin') {
                allowed = true;
            } else if (user.role === 'student') {
                allowed = (user.id === id);
            } else if (user.role === 'teacher') {
                // Check if student belongs to a class taught by this teacher
                allowed = await StudentService.isStudentInTeacherClass(user.id, id);
            }

            if (!allowed) {
                return { status: 403, error: 'Forbidden: Access denied' };
            }

            const student = await StudentService.getById(id);
            if (!student) return { status: 404, error: 'Student not found' };
            return { status: 200, data: student };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /students
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can create students' };
            }

            const validation = validateStudent(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newStudent = await StudentService.create(data);
            return { status: 201, data: newStudent };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /students/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can update students' };
            }

            const updatedStudent = await StudentService.update(id, data);
            if (!updatedStudent) return { status: 404, error: 'Student not found' };
            return { status: 200, data: updatedStudent };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /students/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can delete students' };
            }

            const success = await StudentService.delete(id);
            if (!success) return { status: 404, error: 'Student not found' };
            return { status: 200, data: { message: 'Student deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
