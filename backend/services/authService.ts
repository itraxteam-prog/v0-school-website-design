import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@/backend/data/users';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { validatePassword } from '@/utils/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-123';

const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived
const REFRESH_TOKEN_EXPIRY = '30d'; // Long-lived
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

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
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export const AuthService = {
    validatePasswordStrength: (password: string): boolean => {
        return validatePassword(password).isValid;
    },

    login: async (email: string, password: string): Promise<LoginResult> => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
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
                const updateData: any = { failed_login_attempts: failedAttempts };

                if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                    updateData.lock_until = new Date(Date.now() + LOCK_TIME_MS).toISOString();
                }

                await supabase.from('users').update(updateData).eq('id', user.id);
                return {
                    error: failedAttempts >= MAX_FAILED_ATTEMPTS ? 'Account locked. Try again later.' : 'Invalid email or password',
                    status: failedAttempts >= MAX_FAILED_ATTEMPTS ? 403 : 401
                };
            }

            // Reset failed attempts
            await supabase.from('users').update({ failed_login_attempts: 0, lock_until: null }).eq('id', user.id);

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
        // Access Token - contains full user info for fast authorization
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

        // Refresh Token - unique ID to check against DB
        const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        // Store session in Supabase for centralized revocation
        // Note: Creating 'user_sessions' table might be needed
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
            // 1. Verify Refresh Token signature and expiry
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };

            // 2. Check DB for matching session (enforce revokable state)
            const { data: session, error } = await supabase
                .from('user_sessions')
                .select('*, users(*)')
                .eq('user_id', decoded.id)
                .eq('refresh_token', refreshToken)
                .single();

            if (error || !session || !session.users) {
                return null;
            }

            // 3. Check if session has expired in DB
            if (new Date(session.expires_at).getTime() < Date.now()) {
                await supabase.from('user_sessions').delete().eq('id', session.id);
                return null;
            }

            // 4. Issue new tokens
            const user = session.users;
            const payload: AuthPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
            return await AuthService.generateTokens(payload);
        } catch (error) {
            return null;
        }
    },

    logout: async (userId: string) => {
        // Invalidate session in DB
        await supabase.from('user_sessions').delete().eq('user_id', userId);
    },

    verifyToken: (token: string): AuthPayload | null => {
        try {
            // Explicitly verify expiry and signature
            return jwt.verify(token, JWT_SECRET) as AuthPayload;
        } catch (error) {
            return null;
        }
    },

    // Standard change password logic
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

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, message: 'Failed to change password' };
        }
    },

    forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('id, email')
                .eq('email', email)
                .single();

            if (error || !user) {
                return { success: true, message: 'If an account exists with this email, a reset link has been sent.' };
            }

            // Reset token expires in 1 hour
            const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
            const resetLink = `/portal/reset-password?token=${resetToken}`;

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
            const { error: updateError } = await supabase
                .from('users')
                .update({ password: hashedPassword, failed_login_attempts: 0, lock_until: null })
                .eq('id', decoded.userId);

            if (updateError) return { success: false, message: 'Failed to reset password' };

            return { success: true, message: 'Password reset successfully.' };
        } catch (error) {
            return { success: false, message: 'Invalid or expired reset token' };
        }
    }
};
