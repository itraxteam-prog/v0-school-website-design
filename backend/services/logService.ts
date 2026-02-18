import { supabase } from '../utils/supabaseClient';

export interface LogEntry {
    id?: string;
    user_id: string;
    role: string;
    action: string;
    entity: string;
    entity_id?: string;
    status: 'success' | 'failure';
    metadata?: any;
    timestamp?: string;
}

export const LogService = {
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
            user_id: userId,
            role: role,
            action: action,
            entity: entity,
            entity_id: entityId,
            status: status,
            metadata: details,
            timestamp: new Date().toISOString()
        };

        (async () => {
            try {
                const { error } = await supabase
                    .from('activity_logs')
                    .insert([logEntry]);

                if (error) {
                    console.error('Failed to write log entry:', error.message);
                }
            } catch (err) {
                console.error('Unexpected error in LogService:', err);
            }
        })();
    },

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
