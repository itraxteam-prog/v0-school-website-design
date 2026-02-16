import { LogService } from '../services/logService';

export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 500) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (err: any, userId: string = 'system', role: string = 'system') => {
    console.error(err);
    LogService.logError(userId, role, err);
};

export const handleSupabaseError = (error: any, userId: string = 'system', role: string = 'system') => {
    if (!error) return null;
    console.error('Supabase Error:', error);
    LogService.logError(userId, role, error, 'Supabase');
    return error.message || 'An unexpected database error occurred';
};
