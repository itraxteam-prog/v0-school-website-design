import { Resend } from 'resend';
import { LogService } from './logService';

const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        // Return a mock or null if no key, but don't throw at top level
        console.warn('RESEND_API_KEY is missing. Email delivery will fail.');
        return null;
    }
    return new Resend(apiKey);
};

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';

export const EmailService = {
    /**
     * Sends a transactional email with retry logic.
     * Logs activity to activity_logs via LogService.
     */
    async sendEmail(
        to: string,
        subject: string,
        html: string,
        userId: string,
        role: string = 'user'
    ) {
        let attempts = 0;
        const maxAttempts = 3;
        let success = false;
        let lastError: any = null;

        while (attempts < maxAttempts && !success) {
            attempts++;
            try {
                const resend = getResendClient();
                if (!resend) {
                    throw new Error('Email service not configured: RESEND_API_KEY is missing.');
                }

                const { data, error } = await resend.emails.send({
                    from: FROM_EMAIL,
                    to,
                    subject,
                    html,
                });

                if (error) {
                    throw error;
                }

                success = true;

                // Log success to activity_logs
                LogService.logAction(
                    userId,
                    role,
                    'EMAIL_SENT',
                    'NOTIFICATION',
                    undefined,
                    'success',
                    { to, subject, attempts }
                );

                return data;
            } catch (err: any) {
                lastError = err;
                console.error(`Email attempt ${attempts} failed for ${to}:`, err.message);

                if (attempts < maxAttempts) {
                    // Wait before retrying (exponential backoff: 1s, 2s)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                }
            }
        }

        if (!success) {
            // Log final failure to activity_logs
            LogService.logAction(
                userId,
                role,
                'EMAIL_FAILED',
                'NOTIFICATION',
                undefined,
                'failure',
                {
                    to,
                    subject,
                    error: lastError?.message || 'Unknown error',
                    attempts
                }
            );
            throw lastError || new Error('Failed to send email after maximum attempts');
        }
    }
};
