import { TeacherService } from '../services/teachers';
import { validateTeacher } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';

// Teachers API Routes
// Note: These are integrated into Next.js Route Handlers (app/api/teachers/route.ts)

export const teacherRoutes = {
    // GET /teachers - Authenticated Users
    getAll: async (user: AuthPayload) => {
        try {
            // Everyone needs to see teachers list (e.g. for selection)
            // Or restrict? Reqt: "Admin: Can create, read, update, delete Students, Teachers..."
            // "Teacher: Can read Students...". Doesn't say Teacher can read Teachers.
            // But practically, they need to see colleagues or schedule.
            // I'll allow authenticated read for now.
            const teachers = await TeacherService.getAll();
            return { status: 200, data: teachers };
        } catch (error: any) {
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
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /teachers
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can create teachers' };
            }

            const validation = validateTeacher(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newTeacher = await TeacherService.create(data);
            return { status: 201, data: newTeacher };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /teachers/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                // Maybe teacher can update their own profile?
                // Requirement doesn't specify. Assuming Admin management.
                // If id === user.id?
                if (user.role === 'teacher' && user.id === id) {
                    // Allow self update? "Admin: ... update ... Teachers".
                    // Proceed with Admin only for now as spec is strict.
                }
                return { status: 403, error: 'Forbidden: Only Admins can update teachers' };
            }

            const updatedTeacher = await TeacherService.update(id, data);
            if (!updatedTeacher) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: updatedTeacher };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /teachers/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can delete teachers' };
            }

            const success = await TeacherService.delete(id);
            if (!success) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: { message: 'Teacher deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
