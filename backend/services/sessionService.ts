import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { supabase } from '../utils/supabaseClient';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-123';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export const SessionService = {
    hashToken: (token: string): string => {
        return createHash('sha256').update(token).digest('hex');
    },

    generateTokens: async (payload: AuthPayload) => {
        // Remove roles specifically to avoid claim bloat if necessary, but middleware expects it
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        const refreshTokenHash = SessionService.hashToken(refreshToken);

        try {
            await supabase
                .from('user_sessions')
                .upsert({
                    user_id: payload.id,
                    refresh_token_hash: refreshTokenHash,
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
            const refreshTokenHash = SessionService.hashToken(refreshToken);

            const { data: session, error } = await supabase
                .from('user_sessions')
                .select('*, users(*)')
                .eq('user_id', decoded.id)
                .eq('refresh_token_hash', refreshTokenHash)
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
            return await SessionService.generateTokens(payload);
        } catch (error) {
            return null;
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
    }
};
