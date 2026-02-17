import { supabase } from '../utils/supabaseClient';
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
        // Fire and forget to avoid blocking API responses
        (async () => {
            let logId: string | undefined;
            try {
                // 1. Log the notification as pending
                const log = await NotificationService.logNotification({
                    userId,
                    role,
                    type: 'email',
                    event,
                    message,
                    status: 'pending',
                    sentAt: null
                });

                if (log) logId = log.id;

                // 2. Fetch user's email
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('email')
                    .eq('id', userId)
                    .single();

                if (userError || !user?.email) {
                    throw new Error(`Could not find email for user ${userId}`);
                }

                // 3. Send email via reusable EmailService (includes retry logic)
                await EmailService.sendEmail(
                    user.email,
                    event.replace(/_/g, ' '), // Simple subject from event name
                    `<p>${message}</p>`,
                    userId,
                    role
                );

                // 4. Update status to sent
                if (logId) {
                    await supabase.from('notifications')
                        .update({ status: 'sent', sentAt: new Date().toISOString() })
                        .eq('id', logId);
                }
            } catch (err: any) {
                console.error(`Email delivery failed for user ${userId}:`, err.message);

                // 5. Update status to failed
                if (logId) {
                    await supabase.from('notifications')
                        .update({ status: 'failed' })
                        .eq('id', logId);
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
