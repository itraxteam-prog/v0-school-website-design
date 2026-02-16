import { TeacherService } from '../services/teachers';
import { validateTeacher } from '../utils/validation';

// Teachers API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/teachers/route.ts)

export const teacherRoutes = {
    // GET /teachers
    getAll: async () => {
        try {
            const teachers = await TeacherService.getAll();
            return { status: 200, data: teachers };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /teachers/:id
    getById: async (id: string) => {
        try {
            const teacher = await TeacherService.getById(id);
            if (!teacher) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: teacher };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /teachers
    create: async (data: any) => {
        try {
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
    update: async (id: string, data: any) => {
        try {
            const updatedTeacher = await TeacherService.update(id, data);
            if (!updatedTeacher) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: updatedTeacher };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /teachers/:id
    delete: async (id: string) => {
        try {
            const success = await TeacherService.delete(id);
            if (!success) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: { message: 'Teacher deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
