import { supabase } from '../utils/supabaseClient';
import { LogService } from './logService';

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
     * Logs a generic event to the audit_logs table and also to the unified logs table.
     */
    logEvent: async (
        userId: string,
        actionType: string,
        status: 'success' | 'failure',
        metadata: AuditLogMetadata = {}
    ) => {
        try {
            const timestamp = new Date().toISOString();
            const logEntry = {
                user_id: userId,
                action_type: actionType,
                status: status,
                metadata: metadata,
                timestamp: timestamp,
            };

            // 1. Log to legacy audit_logs table
            const { error } = await supabase
                .from('audit_logs')
                .insert([logEntry]);

            if (error) {
                console.error('Audit logging failed:', error.message);
            }

            // 2. Also log to the new unified logs table
            // We use 'SECURITY' as entity for audit events
            LogService.logAction(
                userId,
                'USER', // Default role for audit events if unknown
                actionType,
                'SECURITY',
                undefined,
                status,
                metadata
            );
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
