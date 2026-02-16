import { PeriodService } from '../services/periods';
import { validatePeriod } from '../utils/validation';
import { AuthPayload } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export const periodRoutes = {
    // GET /periods
    getAll: async (user: AuthPayload) => {
        try {
            // Periods (schedule) are generally public to authenticated users
            const periods = await PeriodService.getAll();
            return { status: 200, data: periods };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'PeriodRoutes.getAll');
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
            LogService.logError(user.id, user.role, error, 'PeriodRoutes.getById');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // POST /periods
    create: async (data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'CREATE_ATTEMPT', 'PERIOD', undefined, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can create periods' };
            }

            const validation = validatePeriod(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newPeriod = await PeriodService.create(data);

            LogService.logAction(user.id, user.role, 'CREATED_PERIOD', 'PERIOD', (newPeriod as any).id, 'success');

            return { status: 201, data: newPeriod };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'PeriodRoutes.create');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // PUT /periods/:id
    update: async (id: string, data: any, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'UPDATE_ATTEMPT', 'PERIOD', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can update periods' };
            }
            const updatedPeriod = await PeriodService.update(id, data);
            if (!updatedPeriod) return { status: 404, error: 'Period not found' };

            LogService.logAction(user.id, user.role, 'UPDATED_PERIOD', 'PERIOD', id, 'success');

            return { status: 200, data: updatedPeriod };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'PeriodRoutes.update');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    },

    // DELETE /periods/:id
    delete: async (id: string, user: AuthPayload) => {
        try {
            if (user.role !== 'admin') {
                LogService.logAction(user.id, user.role, 'DELETE_ATTEMPT', 'PERIOD', id, 'failure', { error: 'Role not admin' });
                return { status: 403, error: 'Forbidden: Only Admins can delete periods' };
            }
            const success = await PeriodService.delete(id);
            if (!success) return { status: 404, error: 'Period not found' };

            LogService.logAction(user.id, user.role, 'DELETED_PERIOD', 'PERIOD', id, 'success');

            return { status: 200, data: { message: 'Period deleted successfully' } };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'PeriodRoutes.delete');
            return { status: 500, error: error.message || 'Internal Server Error' };
        }
    }
};
