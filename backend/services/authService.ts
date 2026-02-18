import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from '@/backend/data/users';
import { supabase } from '../utils/supabaseClient';
import { sql } from '../utils/db';
import { handleSupabaseError } from '../utils/errors';
import { validatePassword } from '@/utils/validation';
import { NotificationService } from './notificationService';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-123';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;
const TWO_FACTOR_TEMP_TOKEN_EXPIRY = '5m';

export interface AuthPayload {
    id: string;
    email: string;
    role: string;
    name?: string;
}

export interface LoginResult {
    user?: Omit<User, 'password'>;
    token?: string;
    refreshToken?: string;
    error?: string;
    status?: number;
    requires2FA?: boolean;
    tempToken?: string;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

export const AuthService = {
    validatePasswordStrength: (password: string): boolean => {
        return validatePassword(password).isValid;
    },

    register: async (data: any): Promise<LoginResult> => {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const result = await sql`
                INSERT INTO public.users (
                    id, email, password, name, role, failed_login_attempts, two_factor_enabled, status
                ) VALUES (
                    ${data.id || `u-${Math.random().toString(36).substr(2, 9)}`}, 
                    ${data.email}, 
                    ${hashedPassword}, 
                    ${data.name}, 
                    ${data.role || 'student'}, 
                    0, 
                    false,
                    'Active'
                ) RETURNING *
            `;

            if (!result || result.length === 0) {
                throw new Error('Failed to insert user into database');
            }

            const newUser = result[0];

            try {
                NotificationService.sendEmailNotification(
                    newUser.id,
                    'WELCOME',
                    `Welcome to Pioneers High, ${newUser.name}! Your account has been created successfully.`,
                    newUser.role
                );
            } catch (notifyError) {
                console.error('Failed to send welcome notification:', notifyError);
            }

            const { password: _, ...userWithoutPassword } = newUser;
            return {
                user: userWithoutPassword as any,
                status: 201
            };
        } catch (error: any) {
            console.error('AuthService.register error:', error);
            return { error: error.message || 'An unexpected error occurred', status: 500 };
        }
    },

    login: async (email: string, password: string): Promise<LoginResult> => {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const result = await sql`
                SELECT * FROM public.users 
                WHERE LOWER(email) = LOWER(${normalizedEmail}) 
                LIMIT 1
            `;
            const user = result?.[0];

            if (!user) {
                return { error: 'Invalid email or password', status: 401 };
            }

            if (user.lock_until && new Date(user.lock_until).getTime() > Date.now()) {
                return { error: 'Account locked. Try again later.', status: 403 };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                const failedAttempts = (user.failed_login_attempts || 0) + 1;

                if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                    await sql`
                        UPDATE public.users 
                        SET failed_login_attempts = ${failedAttempts}, lock_until = ${new Date(Date.now() + LOCK_TIME_MS).toISOString()}
                        WHERE id = ${user.id}
                    `;
                } else {
                    await sql`
                        UPDATE public.users 
                        SET failed_login_attempts = ${failedAttempts}
                        WHERE id = ${user.id}
                    `;
                }
                return {
                    error: failedAttempts >= MAX_FAILED_ATTEMPTS ? 'Account locked. Try again later.' : 'Invalid email or password',
                    status: failedAttempts >= MAX_FAILED_ATTEMPTS ? 403 : 401
                };
            }

            await sql`
                UPDATE public.users 
                SET failed_login_attempts = 0, lock_until = NULL 
                WHERE id = ${user.id}
            `;

            if (user.two_factor_enabled) {
                const tempToken = jwt.sign(
                    { id: user.id, email: user.email, purpose: '2fa_verification' },
                    JWT_SECRET,
                    { expiresIn: TWO_FACTOR_TEMP_TOKEN_EXPIRY }
                );

                return {
                    requires2FA: true,
                    tempToken,
                    status: 202
                };
            }

            const payload: AuthPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
            const { token, refreshToken } = await AuthService.generateTokens(payload);

            const { password: _, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                token,
                refreshToken,
                status: 200
            };
        } catch (error) {
            console.error('AuthService.login error:', error);
            return { error: 'An unexpected error occurred', status: 500 };
        }
    },

    generateTokens: async (payload: AuthPayload) => {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        try {
            await supabase
                .from('user_sessions')
                .upsert({
                    user_id: payload.id,
                    refresh_token: refreshToken,
                    expires_at: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000).toISOString()
                }, { onConflict: 'user_id' });
        } catch (err) {
            console.error('Failed to store session:', err);
        }

        return { token, refreshToken };
    },

    refreshSession: async (refreshToken: string) => {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
            const { data: session, error } = await supabase
                .from('user_sessions')
                .select('*, users(*)')
                .eq('user_id', decoded.id)
                .eq('refresh_token', refreshToken)
                .single();

            if (error || !session || !session.users) {
                return null;
            }

            if (new Date(session.expires_at).getTime() < Date.now()) {
                await supabase.from('user_sessions').delete().eq('id', session.id);
                return null;
            }

            const user = session.users;
            const payload: AuthPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
            return await AuthService.generateTokens(payload);
        } catch (error) {
            return null;
        }
    },

    setup2FA: async (userId: string): Promise<{ secret: string; qrCode: string } | null> => {
        try {
            const { data: user, error } = await supabase.from('users').select('email').eq('id', userId).single();
            if (error || !user) return null;

            const secret = speakeasy.generateSecret({
                name: `Pioneers High (${user.email})`,
            });

            const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

            await supabase.from('users').update({
                two_factor_temp_secret: secret.base32
            }).eq('id', userId);

            return {
                secret: secret.base32,
                qrCode
            };
        } catch (error) {
            console.error('setup2FA error:', error);
            return null;
        }
    },

    verifyAndEnable2FA: async (userId: string, code: string): Promise<{ success: boolean; message: string; recoveryCodes?: string[] }> => {
        try {
            const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
            if (error || !user || !user.two_factor_temp_secret) {
                return { success: false, message: '2FA setup not initiated' };
            }

            const verified = speakeasy.totp.verify({
                secret: user.two_factor_temp_secret,
                encoding: 'base32',
                token: code
            });

            if (!verified) {
                return { success: false, message: 'Invalid verification code' };
            }

            const recoveryCodes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());

            await supabase.from('users').update({
                two_factor_enabled: true,
                two_factor_secret: user.two_factor_temp_secret,
                two_factor_temp_secret: null,
                recovery_codes: recoveryCodes
            }).eq('id', userId);

            NotificationService.sendEmailNotification(userId, '2FA_ENABLED', 'Two-factor authentication has been successfully enabled for your account.', user.role);

            return { success: true, message: '2FA enabled successfully', recoveryCodes };
        } catch (error) {
            return { success: false, message: 'Verification failed' };
        }
    },

    verify2FALogin: async (tempToken: string, code: string): Promise<LoginResult> => {
        try {
            const decoded = jwt.verify(tempToken, JWT_SECRET) as { id: string, purpose: string };
            if (decoded.purpose !== '2fa_verification') {
                return { error: 'Invalid 2FA session', status: 401 };
            }

            const { data: user, error } = await supabase.from('users').select('*').eq('id', decoded.id).single();
            if (error || !user || !user.two_factor_secret) {
                return { error: '2FA not enabled for this account', status: 400 };
            }

            const verified = speakeasy.totp.verify({
                secret: user.two_factor_secret,
                encoding: 'base32',
                token: code
            });

            if (!verified) {
                const isRecoveryCode = user.recovery_codes?.includes(code);
                if (isRecoveryCode) {
                    const remainingCodes = user.recovery_codes.filter((c: string) => c !== code);
                    await supabase.from('users').update({ recovery_codes: remainingCodes }).eq('id', user.id);
                } else {
                    return { error: 'Invalid 2FA code', status: 401 };
                }
            }

            const payload: AuthPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
            const { token, refreshToken } = await AuthService.generateTokens(payload);

            const { password: _, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                token,
                refreshToken,
                status: 200
            };
        } catch (error) {
            return { error: 'Invalid or expired 2FA session', status: 401 };
        }
    },

    disable2FA: async (userId: string, password?: string): Promise<{ success: boolean; message: string }> => {
        try {
            if (password) {
                const { data: user, error } = await supabase.from('users').select('password').eq('id', userId).single();
                if (error || !user) return { success: false, message: 'User not found' };

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return { success: false, message: 'Incorrect password' };
            }

            await supabase.from('users').update({
                two_factor_enabled: false,
                two_factor_secret: null,
                recovery_codes: null
            }).eq('id', userId);

            return { success: true, message: '2FA disabled successfully' };
        } catch (error) {
            return { success: false, message: 'Failed to disable 2FA' };
        }
    },

    logout: async (userId: string) => {
        await supabase.from('user_sessions').delete().eq('user_id', userId);
    },

    verifyToken: (token: string): AuthPayload | null => {
        try {
            return jwt.verify(token, JWT_SECRET) as AuthPayload;
        } catch (error) {
            return null;
        }
    },

    changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
            if (error || !user) return { success: false, message: 'User not found' };

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return { success: false, message: 'Incorrect current password' };

            const validation = validatePassword(newPassword);
            if (!validation.isValid) {
                return { success: false, message: `Weak password: ${validation.feedback.join(", ")}` };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await supabase.from('users').update({ password: hashedPassword }).eq('id', userId);

            NotificationService.sendEmailNotification(userId, 'PASSWORD_CHANGED', 'Your password has been successfully changed.', user.role);

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, message: 'Failed to change password' };
        }
    },

    forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('id, email, role')
                .eq('email', email)
                .single();

            if (error || !user) {
                return { success: true, message: 'If an account exists with this email, a reset link has been sent.' };
            }

            const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
            const resetLink = `/portal/reset-password?token=${resetToken}`;

            NotificationService.sendEmailNotification(user.id, 'PASSWORD_RESET_REQUEST', `You requested a password reset. Use this link: ${resetLink}`, user.role);

            return {
                success: true,
                message: 'A reset link has been sent to your email.',
                resetLink
            };
        } catch (error) {
            return { success: false, message: 'Failed to process forgot password request' };
        }
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, type: string };
            if (!decoded || decoded.type !== 'reset') {
                return { success: false, message: 'Invalid or expired reset token' };
            }

            const validation = validatePassword(newPassword);
            if (!validation.isValid) {
                return { success: false, message: `Weak password: ${validation.feedback.join(", ")}` };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const { data: user, error: userError } = await supabase.from('users').select('role').eq('id', decoded.userId).single();

            const { error: updateError } = await supabase
                .from('users')
                .update({ password: hashedPassword, failed_login_attempts: 0, lock_until: null })
                .eq('id', decoded.userId);

            if (updateError) return { success: false, message: 'Failed to reset password' };

            NotificationService.sendEmailNotification(decoded.userId, 'PASSWORD_RESET_SUCCESS', 'Your password has been successfully reset.', user?.role || 'user');

            return { success: true, message: 'Password reset successfully.' };
        } catch (error) {
            return { success: false, message: 'Invalid or expired reset token' };
        }
    }
};
