import { supabase } from '../utils/supabaseClient';

export interface LogEntry {
    id?: string;
    userId: string;
    role: string;
    action: string;
    entity: string;
    entityId?: string;
    timestamp?: string;
    status: 'success' | 'failure';
    details?: any;
}

export const LogService = {
    /**
     * Logs an action to the Supabase logs table.
     * This is designed to be non-blocking - it doesn't await the database call.
     */
    logAction: (
        userId: string,
        role: string,
        action: string,
        entity: string,
        entityId?: string,
        status: 'success' | 'failure' = 'success',
        details?: any
    ) => {
        const logEntry: LogEntry = {
            userId,
            role,
            action,
            entity,
            entityId,
            status,
            details,
            timestamp: new Date().toISOString()
        };

        // Fire and forget - don't await to keep it non-blocking
        supabase
            .from('logs')
            .insert([logEntry])
            .then(({ error }) => {
                if (error) {
                    console.error('Failed to write log entry:', error.message);
                }
            })
            .catch(err => {
                console.error('Unexpected error in LogService:', err);
            });
    },

    /**
     * Logs API performance metrics
     */
    logPerformance: (path: string, method: string, durationMs: number, status: number) => {
        LogService.logAction(
            'system',
            'system',
            'PERFORMANCE',
            'API',
            undefined,
            status < 400 ? 'success' : 'failure',
            { path, method, durationMs, status }
        );
    },

    /**
     * Logs system errors
     */
    logError: (userId: string | 'system', role: string | 'system', error: any, context?: string) => {
        LogService.logAction(
            userId,
            role,
            'ERROR',
            'SYSTEM',
            undefined,
            'failure',
            {
                message: error?.message || 'Unknown error',
                stack: error?.stack,
                context
            }
        );
    }
};
