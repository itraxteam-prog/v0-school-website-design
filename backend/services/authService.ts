import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@/backend/data/users';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const TOKEN_EXPIRY = '24h';

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

export interface LoginResult {
    user?: Omit<User, 'password'>;
    token?: string;
    error?: string;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export const AuthService = {
    validatePasswordStrength: (password: string): boolean => {
        return password.length >= 8 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
    },

    login: async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResult> => {
        try {
            // Find user by email in Supabase
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                return { error: 'Invalid email or password' };
            }

            // Check if account is locked
            if (user.lock_until && new Date(user.lock_until).getTime() > Date.now()) {
                return { error: 'Account locked. Try again later.' };
            }

            // Verify password using bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                // Increment failed attempts
                const failedAttempts = (user.failed_login_attempts || 0) + 1;
                const updateData: any = { failed_login_attempts: failedAttempts };

                if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                    updateData.lock_until = new Date(Date.now() + LOCK_TIME_MS).toISOString();
                }

                await supabase.from('users').update(updateData).eq('id', user.id);

                if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                    return { error: 'Account locked. Try again later.' };
                }

                return { error: 'Invalid email or password' };
            }

            // Reset failed attempts on successful login
            await supabase.from('users')
                .update({ failed_login_attempts: 0, lock_until: null })
                .eq('id', user.id);

            const tokenUser: User = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                password: '', // Don't include password in token source
                failedLoginAttempts: 0,
                lockUntil: null
            };

            const token = AuthService.generateToken(tokenUser, rememberMe);

            // Return user without password
            const { password: _, ...userWithoutPassword } = tokenUser;

            return {
                user: userWithoutPassword,
                token
            };
        } catch (error) {
            console.error('AuthService.login error:', error);
            return { error: 'An unexpected error occurred' };
        }
    },

    changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error || !user) return { success: false, message: 'User not found' };

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return { success: false, message: 'Incorrect current password' };

            if (!AuthService.validatePasswordStrength(newPassword)) {
                return { success: false, message: 'Password must be at least 8 characters long and contain at least one number and one special character.' };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const { error: updateError } = await supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', userId);

            if (updateError) throw new Error(handleSupabaseError(updateError));

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            console.error('AuthService.changePassword error:', error);
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

            // In a real app, you'd use Supabase Auth for this, but if we're doing it manually:
            const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });

            // Store reset token if needed, or just include it in link
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

            if (!AuthService.validatePasswordStrength(newPassword)) {
                return { success: false, message: 'Password must be at least 8 characters long and contain at least one number and one special character.' };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const { error: updateError } = await supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', decoded.userId);

            if (updateError) return { success: false, message: 'Failed to reset password' };

            return { success: true, message: 'Password reset successfully.' };
        } catch (error) {
            return { success: false, message: 'Invalid or expired reset token' };
        }
    },

    generateToken: (user: User, persistent: boolean = false): string => {
        const expiresIn = persistent ? '30d' : TOKEN_EXPIRY;
        return jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn }
        );
    },

    verifyToken: (token: string): any => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};

