import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users, User } from '@/backend/data/users';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const TOKEN_EXPIRY = '24h';

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

const resetTokens = new Map<string, { email: string; expires: number }>();

export interface LoginResult {
    user?: Omit<User, 'password'>;
    token?: string;
    error?: string;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export const AuthService = {
    // ... (validatePasswordStrength remains above)

    login: async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResult> => {
        // Simulate async database call
        await new Promise(resolve => setTimeout(resolve, 100));

        // Find user by email first
        const user = users.find(u => u.email === email);

        if (!user) {
            return { error: 'Invalid email or password' };
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return { error: 'Account locked. Try again later.' };
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // Increment failed attempts
            user.failedLoginAttempts += 1;

            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_TIME_MS;
                return { error: 'Account locked. Try again later.' };
            }

            return { error: 'Invalid email or password' };
        }

        // Reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        user.lockUntil = null;

        const token = AuthService.generateToken(user, rememberMe);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    },

    changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        const user = users.find(u => u.id === userId);
        if (!user) return { success: false, message: 'User not found' };

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return { success: false, message: 'Incorrect current password' };

        if (!AuthService.validatePasswordStrength(newPassword)) {
            return { success: false, message: 'Password must be at least 8 characters long and contain at least one number and one special character.' };
        }

        user.password = await bcrypt.hash(newPassword, 10);
        return { success: true, message: 'Password changed successfully' };
    },

    forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
        const user = users.find(u => u.email === email);
        if (!user) {
            // Still return success for security reasons (don't reveal if email exists)
            return { success: true, message: 'If an account exists with this email, a reset link has been sent.' };
        }

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        resetTokens.set(token, {
            email,
            expires: Date.now() + 3600000 // 1 hour
        });

        const resetLink = `/portal/reset-password?token=${token}`;
        return {
            success: true,
            message: 'A reset link has been sent to your email.',
            resetLink // In a real app, this would be emailed
        };
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        const resetData = resetTokens.get(token);
        if (!resetData || resetData.expires < Date.now()) {
            return { success: false, message: 'Invalid or expired reset token' };
        }

        const user = users.find(u => u.email === resetData.email);
        if (!user) return { success: false, message: 'User not found' };

        if (!AuthService.validatePasswordStrength(newPassword)) {
            return { success: false, message: 'Password must be at least 8 characters long and contain at least one number and one special character.' };
        }

        user.password = await bcrypt.hash(newPassword, 10);
        resetTokens.delete(token);
        return { success: true, message: 'Password reset successfully. You can now login with your new password.' };
    },

    generateToken: (user: User, persistent: boolean = false): string => {
        // ... (existing implementation)
        const expiresIn = persistent ? '30d' : TOKEN_EXPIRY;
        return jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn }
        );
    },

    verifyToken: (token: string): any => {
        // ... (existing implementation)
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};
