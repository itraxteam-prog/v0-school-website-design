import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, AuthPayload } from '../types';
import { supabase } from '../utils/supabaseClient';
import { validatePassword } from '@/utils/validation';
import { NotificationService } from './notificationService';
import { SessionService } from './sessionService';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const TWO_FACTOR_TEMP_TOKEN_EXPIRY = '5m';
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

export interface LoginResult {
    user?: Omit<User, 'password'>;
    token?: string;
    refreshToken?: string;
    error?: string;
    status?: number;
    requires2FA?: boolean;
    tempToken?: string;
}

export const LoginService = {
    validatePasswordStrength: (password: string): boolean => {
        return validatePassword(password).isValid;
    },

    register: async (data: any): Promise<LoginResult> => {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userId = data.id || `u-${Math.random().toString(36).substr(2, 9)}`;

            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    id: userId,
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    role: data.role || 'student',
                    failed_login_attempts: 0,
                    two_factor_enabled: false,
                    status: 'Active'
                })
                .select()
                .single();

            if (error || !newUser) {
                throw new Error(error?.message || 'Failed to insert user into database');
            }

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
            console.error('LoginService.register error:', error);
            return { error: error.message || 'An unexpected error occurred', status: 500 };
        }
    },

    login: async (email: string, password: string): Promise<LoginResult> => {
        try {
            const normalizedEmail = email.toLowerCase().trim();

            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .ilike('email', normalizedEmail)
                .single();

            if (error || !user) {
                return { error: 'Invalid email or password', status: 401 };
            }

            if (user.lock_until && new Date(user.lock_until).getTime() > Date.now()) {
                return { error: 'Account locked. Try again later.', status: 403 };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                const failedAttempts = (user.failed_login_attempts || 0) + 1;

                if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                    await supabase
                        .from('users')
                        .update({
                            failed_login_attempts: failedAttempts,
                            lock_until: new Date(Date.now() + LOCK_TIME_MS).toISOString()
                        })
                        .eq('id', user.id);
                } else {
                    await supabase
                        .from('users')
                        .update({ failed_login_attempts: failedAttempts })
                        .eq('id', user.id);
                }
                return {
                    error: failedAttempts >= MAX_FAILED_ATTEMPTS ? 'Account locked. Try again later.' : 'Invalid email or password',
                    status: failedAttempts >= MAX_FAILED_ATTEMPTS ? 403 : 401
                };
            }

            await supabase
                .from('users')
                .update({ failed_login_attempts: 0, lock_until: null })
                .eq('id', user.id);

            if (user.two_factor_enabled) {
                const tempToken = jwt.sign(
                    { id: user.id, email: user.email, role: user.role, purpose: '2fa_verification' },
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
            const { token, refreshToken } = await SessionService.generateTokens(payload);

            const { password: _, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                token,
                refreshToken,
                status: 200
            };
        } catch (error) {
            console.error('LoginService.login error:', error);
            return { error: 'An unexpected error occurred', status: 500 };
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
                .ilike('email', email)
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
