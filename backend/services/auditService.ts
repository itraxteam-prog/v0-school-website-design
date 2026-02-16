import { supabase } from '../utils/supabaseClient';

export interface AuditLogMetadata {
    ip?: string;
    userAgent?: string;
    [key: string]: any;
}

export interface AuditLog {
    id?: string;
    timestamp: string;
    user_id: string;
    action_type: string;
    status: 'success' | 'failure';
    metadata: AuditLogMetadata;
}

export const AuditService = {
    /**
     * Logs a generic event to the audit_logs table
     */
    logEvent: async (
        userId: string,
        actionType: string,
        status: 'success' | 'failure',
        metadata: AuditLogMetadata = {}
    ) => {
        try {
            const logEntry = {
                user_id: userId,
                action_type: actionType,
                status: status,
                metadata: metadata,
                timestamp: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('audit_logs')
                .insert([logEntry]);

            if (error) {
                console.error('Audit logging failed:', error.message);
            }
        } catch (err) {
            // Catch and console error as per requirements, don't break the main action
            console.error('Unexpected error in AuditService.logEvent:', err);
        }
    },

    /**
     * Specifically logs login attempts
     */
    logLoginAttempt: async (userId: string, status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, 'LOGIN_ATTEMPT', status, metadata);
    },

    /**
     * Specifically logs password changes
     */
    logPasswordChange: async (userId: string, status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, 'PASSWORD_CHANGE', status, metadata);
    },

    /**
     * Specifically logs 2FA setup/enable/disable events
     */
    log2FASetup: async (userId: string, action: 'ENABLE' | 'DISABLE' | 'SETUP', status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, `2FA_${action}`, status, metadata);
    },

    /**
     * Specifically logs critical user profile/role updates
     */
    logUserUpdate: async (userId: string, status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, 'USER_UPDATE', status, metadata);
    }
};
