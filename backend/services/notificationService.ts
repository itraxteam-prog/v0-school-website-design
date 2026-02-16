import { supabase } from '../utils/supabaseClient';
import { LogService } from './logService';

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

const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'noreply@school.com';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const NotificationService = {
    /**
     * Internal utility to log a notification to Supabase
     */
    async logNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([notification])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err: any) {
            console.error('Failed to log notification:', err.message);
            return null;
        }
    },

    /**
     * Sends an email notification (Async)
     */
    async sendEmailNotification(userId: string, event: string, message: string, role: string = 'user') {
        // Fire and forget to avoid blocking
        (async () => {
            const status = 'pending';
            const log = await NotificationService.logNotification({
                userId,
                role,
                type: 'email',
                event,
                message,
                status,
                sentAt: null
            });

            try {
                // Implementation for email service (e.g., SendGrid/Nodemailer)
                // if (!EMAIL_API_KEY) throw new Error('Email API Key not configured');

                // Simulated successful send
                console.log(`Sending Email to ${userId}: [${event}] ${message}`);

                if (log) {
                    await supabase.from('notifications')
                        .update({ status: 'sent', sentAt: new Date().toISOString() })
                        .eq('id', log.id);
                }
            } catch (err: any) {
                console.error(`Email delivery failed for user ${userId}:`, err.message);
                if (log) {
                    await supabase.from('notifications')
                        .update({ status: 'failed' })
                        .eq('id', log.id);
                }
                LogService.logError(userId, role, err, 'EmailNotification');
            }
        })();
    },

    /**
     * Sends an SMS notification (Async)
     */
    async sendSMSNotification(userId: string, event: string, message: string, role: string = 'user') {
        // Fire and forget to avoid blocking
        (async () => {
            const status = 'pending';
            const log = await NotificationService.logNotification({
                userId,
                role,
                type: 'sms',
                event,
                message,
                status,
                sentAt: null
            });

            try {
                // Implementation for Twilio (Simulated)
                // if (!TWILIO_ACCOUNT_SID) throw new Error('Twilio SID not configured');

                console.log(`Sending SMS to ${userId}: [${event}] ${message}`);

                if (log) {
                    await supabase.from('notifications')
                        .update({ status: 'sent', sentAt: new Date().toISOString() })
                        .eq('id', log.id);
                }
            } catch (err: any) {
                console.error(`SMS delivery failed for user ${userId}:`, err.message);
                if (log) {
                    await supabase.from('notifications')
                        .update({ status: 'failed' })
                        .eq('id', log.id);
                }
                LogService.logError(userId, role, err, 'SMSNotification');
            }
        })();
    }
};
