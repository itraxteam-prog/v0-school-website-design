import { StudentService } from '../services/students';
import { validateStudent } from '../utils/validation';

// Students API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/students/route.ts)

export const studentRoutes = {
    // GET /students
    getAll: async () => {
        try {
            const students = await StudentService.getAll();
            return { status: 200, data: students };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /students/:id
    getById: async (id: string) => {
        try {
            const student = await StudentService.getById(id);
            if (!student) return { status: 404, error: 'Student not found' };
            return { status: 200, data: student };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /students
    create: async (data: any) => {
        try {
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
    update: async (id: string, data: any) => {
        try {
            const updatedStudent = await StudentService.update(id, data);
            if (!updatedStudent) return { status: 404, error: 'Student not found' };
            return { status: 200, data: updatedStudent };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /students/:id
    delete: async (id: string) => {
        try {
            const success = await StudentService.delete(id);
            if (!success) return { status: 404, error: 'Student not found' };
            return { status: 200, data: { message: 'Student deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
