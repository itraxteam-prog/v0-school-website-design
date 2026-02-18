export interface LogEntry {
    id?: string;
    user_id: string; // Changed from userId to user_id to match DB
    role: string;
    action: string;
    entity: string;
    entity_id?: string; // Changed from entityId to entity_id to match DB
    status: 'success' | 'failure';
    metadata?: any; // Changed from details to metadata to match DB
    timestamp?: string;
}

export const LogService = {
    /**
     * Logs an action - Logic removed
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
        console.warn(`LogService.logAction(${action}): Supabase logic removed.`);
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
