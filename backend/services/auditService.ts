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

            const { error } = await supabase
                .from('audit_logs')
                .insert([logEntry]);

            if (error) {
                console.error('Audit logging failed:', error.message);
            }

            LogService.logAction(
                userId,
                'USER',
                actionType,
                'SECURITY',
                undefined,
                status,
                metadata
            );
        } catch (err) {
            console.error('Unexpected error in AuditService.logEvent:', err);
        }
    },

    logLoginAttempt: async (userId: string, status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, 'LOGIN_ATTEMPT', status, metadata);
    },

    logPasswordChange: async (userId: string, status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, 'PASSWORD_CHANGE', status, metadata);
    },

    log2FASetup: async (userId: string, action: 'ENABLE' | 'DISABLE' | 'SETUP', status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, `2FA_${action}`, status, metadata);
    },

    logUserUpdate: async (userId: string, status: 'success' | 'failure', metadata: AuditLogMetadata) => {
        await AuditService.logEvent(userId, 'USER_UPDATE', status, metadata);
    }
};
