import { LogService } from './logService';
import { EmailService } from './emailService';

export interface Notification {
    id?: string;
    userId: string;
    role: string;
    type: 'email' | 'sms';
    event: string;
    message: string;
    status: 'pending' | 'sent' | 'failed';
    createdAt?: string;
    sentAt?: string | null;
}

export const NotificationService = {
    /**
     * Internal utility to log a notification - Logic removed
     */
    async logNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
        console.warn("NotificationService.logNotification: Supabase logic removed.");
        return { id: 'dummy-id', ...notification };
    },

    /**
     * Sends an email notification (Async) - Logic removed
     */
    async sendEmailNotification(userId: string, event: string, message: string, role: string = 'user') {
        console.warn(`NotificationService.sendEmailNotification(${userId}): Supabase logic removed.`);
    },

    /**
     * Sends an SMS notification (Async) - Logic removed
     */
    async sendSMSNotification(userId: string, event: string, message: string, role: string = 'user') {
        console.warn(`NotificationService.sendSMSNotification(${userId}): Supabase logic removed.`);
    }
};
