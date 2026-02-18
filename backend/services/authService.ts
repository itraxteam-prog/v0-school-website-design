import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/utils/validation';
import { NotificationService } from './notificationService';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-123';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';
const TWO_FACTOR_TEMP_TOKEN_EXPIRY = '5m';

export interface AuthPayload {
    id: string;
    email: string;
    role: string;
    name?: string;
}

export interface LoginResult {
    user?: any;
    token?: string;
    refreshToken?: string;
    error?: string;
    status?: number;
    requires2FA?: boolean;
    tempToken?: string;
}

export const AuthService = {
    validatePasswordStrength: (password: string): boolean => {
        return validatePassword(password).isValid;
    },

    register: async (data: any): Promise<LoginResult> => {
        console.warn("AuthService.register: Database logic removed.");
        return { error: 'Database connection removed. Registration unavailable.', status: 503 };
    },

    login: async (email: string, password: string): Promise<LoginResult> => {
        console.warn("AuthService.login: Database logic removed.");
        return { error: 'Database connection removed. Login unavailable.', status: 503 };
    },

    generateTokens: async (payload: AuthPayload) => {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        return { token, refreshToken };
    },

    refreshSession: async (refreshToken: string) => {
        console.warn("AuthService.refreshSession: Database logic removed.");
        return null;
    },

    setup2FA: async (userId: string) => {
        console.warn("AuthService.setup2FA: Database logic removed.");
        return null;
    },

    verifyAndEnable2FA: async (userId: string, code: string) => {
        console.warn("AuthService.verifyAndEnable2FA: Database logic removed.");
        return { success: false, message: 'Database connection removed.' };
    },

    verify2FALogin: async (tempToken: string, code: string) => {
        console.warn("AuthService.verify2FALogin: Database logic removed.");
        return { error: 'Database connection removed.', status: 503 };
    },

    disable2FA: async (userId: string, password?: string) => {
        console.warn("AuthService.disable2FA: Database logic removed.");
        return { success: false, message: 'Database connection removed.' };
    },

    logout: async (userId: string) => {
        console.warn("AuthService.logout: Database logic removed.");
    },

    verifyToken: (token: string): AuthPayload | null => {
        try {
            return jwt.verify(token, JWT_SECRET) as AuthPayload;
        } catch (error) {
            return null;
        }
    },

    changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
        console.warn("AuthService.changePassword: Database logic removed.");
        return { success: false, message: 'Database connection removed.' };
    },

    forgotPassword: async (email: string) => {
        console.warn("AuthService.forgotPassword: Database logic removed.");
        return { success: false, message: 'Database connection removed.' };
    },

    resetPassword: async (token: string, newPassword: string) => {
        console.warn("AuthService.resetPassword: Database logic removed.");
        return { success: false, message: 'Database connection removed.' };
    }
};
