import { TeacherService } from '../services/teachers';
import { validateTeacher } from '../utils/validation';

// Teachers API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/teachers/route.ts)

export const teacherRoutes = {
    // GET /teachers
    getAll: async () => {
        try {
            const teachers = TeacherService.getAll();
            return { status: 200, data: teachers };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // GET /teachers/:id
    getById: async (id: string) => {
        try {
            const teacher = TeacherService.getById(id);
            if (!teacher) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: teacher };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /teachers
    create: async (data: any) => {
        try {
            const validation = validateTeacher(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newTeacher = TeacherService.create(data);
            return { status: 201, data: newTeacher };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // PUT /teachers/:id
    update: async (id: string, data: any) => {
        try {
            const updatedTeacher = TeacherService.update(id, data);
            if (!updatedTeacher) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: updatedTeacher };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // DELETE /teachers/:id
    delete: async (id: string) => {
        try {
            const success = TeacherService.delete(id);
            if (!success) return { status: 404, error: 'Teacher not found' };
            return { status: 200, data: { message: 'Teacher deleted successfully' } };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    }
};
