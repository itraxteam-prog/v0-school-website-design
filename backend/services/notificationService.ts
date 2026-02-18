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

export const NotificationService = {
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

    async sendEmailNotification(userId: string, event: string, message: string, role: string = 'user') {
        (async () => {
            let logId: string | undefined;
            try {
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

                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('email')
                    .eq('id', userId)
                    .single();

                if (userError || !user?.email) {
                    throw new Error(`Could not find email for user ${userId}`);
                }

                await EmailService.sendEmail(
                    user.email,
                    event.replace(/_/g, ' '),
                    `<p>${message}</p>`,
                    userId,
                    role
                );

                if (logId) {
                    await supabase.from('notifications')
                        .update({ status: 'sent', sentAt: new Date().toISOString() })
                        .eq('id', logId);
                }
            } catch (err: any) {
                console.error(`Email delivery failed for user ${userId}:`, err.message);
                if (logId) {
                    await supabase.from('notifications')
                        .update({ status: 'failed' })
                        .eq('id', logId);
                }
                LogService.logError(userId, role, err, 'EmailNotification');
            }
        })();
    },

    async sendSMSNotification(userId: string, event: string, message: string, role: string = 'user') {
        (async () => {
            const log = await NotificationService.logNotification({
                userId,
                role,
                type: 'sms',
                event,
                message,
                status: 'pending',
                sentAt: null
            });

            try {
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
