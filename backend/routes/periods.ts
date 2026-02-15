import { PeriodService } from '../services/periods';
import { validatePeriod } from '../utils/validation';

// Periods API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/periods/route.ts)

export const periodRoutes = {
    // GET /periods
    getAll: async () => {
        try {
            const periods = PeriodService.getAll();
            return { status: 200, data: periods };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // GET /periods/:id
    getById: async (id: string) => {
        try {
            const period = PeriodService.getById(id);
            if (!period) return { status: 404, error: 'Period not found' };
            return { status: 200, data: period };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /periods
    create: async (data: any) => {
        try {
            const validation = validatePeriod(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newPeriod = PeriodService.create(data);
            return { status: 201, data: newPeriod };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // PUT /periods/:id
    update: async (id: string, data: any) => {
        try {
            const updatedPeriod = PeriodService.update(id, data);
            if (!updatedPeriod) return { status: 404, error: 'Period not found' };
            return { status: 200, data: updatedPeriod };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // DELETE /periods/:id
    delete: async (id: string) => {
        try {
            const success = PeriodService.delete(id);
            if (!success) return { status: 404, error: 'Period not found' };
            return { status: 200, data: { message: 'Period deleted successfully' } };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    }
};
