import { jwtVerify } from 'jose';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { supabase } from '../utils/supabaseClient';
import { NotificationService } from './notificationService';
import { SessionService } from './sessionService';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET);

export const TwoFactorService = {
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

    verify2FALogin: async (tempToken: string, code: string) => {
        try {
            // Use jose for signature-verified JWT decoding (replaces jsonwebtoken)
            const { payload: decoded } = await jwtVerify(tempToken, ENCODED_SECRET);

            if (decoded.purpose !== '2fa_verification') {
                return { error: 'Invalid 2FA session', status: 401 };
            }

            const userId = decoded.id as string;

            const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
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
            const { token, refreshToken } = await SessionService.generateTokens(payload);

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
    }
};
