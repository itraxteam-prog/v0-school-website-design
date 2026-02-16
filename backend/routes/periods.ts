import { PeriodService } from '../services/periods';
import { validatePeriod } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';

// Periods API Routes
// Note: These are integrated into Next.js Route Handlers (app/api/periods/route.ts)

export const periodRoutes = {
    // GET /periods
    getAll: async (user: AuthPayload) => {
        try {
            // Periods (schedule) are generally public to authenticated users
            const periods = await PeriodService.getAll();
            return { status: 200, data: periods };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // GET /periods/:id
    getById: async (id: string, user: AuthPayload) => {
        try {
            const period = await PeriodService.getById(id);
            if (!period) return { status: 404, error: 'Period not found' };
            return { status: 200, data: period };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /periods
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can create periods' };
            }

            const validation = validatePeriod(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newPeriod = await PeriodService.create(data);
            return { status: 201, data: newPeriod };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /periods/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can update periods' };
            }
            const updatedPeriod = await PeriodService.update(id, data);
            if (!updatedPeriod) return { status: 404, error: 'Period not found' };
            return { status: 200, data: updatedPeriod };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /periods/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                return { status: 403, error: 'Forbidden: Only Admins can delete periods' };
            }
            const success = await PeriodService.delete(id);
            if (!success) return { status: 404, error: 'Period not found' };
            return { status: 200, data: { message: 'Period deleted successfully' } };
        } catch (error: any) {
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
