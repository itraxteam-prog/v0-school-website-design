import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';
import { validateBody, TwoFactorSchema } from '@/backend/validation/schemas';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(TwoFactorSchema, body);
        if (validation.error) {
            LogService.logAction('system', 'guest', 'LOGIN_2FA_ATTEMPT', 'AUTH', undefined, 'failure', { ...metadata, error: validation.error });
            return createErrorResponse(validation.error, 400);
        }

        const { tempToken, code, rememberMe } = body;

        const result = await AuthService.verify2FALogin(tempToken, code);

        if (result.error || !result.token) {
            // Log failed 2FA login
            LogService.logAction('system', 'guest', 'LOGIN_2FA_ATTEMPT', 'AUTH', undefined, 'failure', { ...metadata, error: result.error || '2FA Verification failed' });
            return createErrorResponse(result.error || 'Verification failed', result.status || 401);
        }

        // Log successful 2FA login
        if (result.user?.id) {
            LogService.logAction(result.user.id, result.user.role, 'LOGIN_2FA', 'AUTH', undefined, 'success', metadata);
        }

        const userData = {
            id: result.user?.id,
            name: result.user?.name,
            role: result.user?.role,
            email: result.user?.email
        };

        const response = createResponse({ user: userData }, 200);

        const cookieOptions: any = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        };

        // Access Token - Short lived
        response.cookies.set('token', result.token, {
            ...cookieOptions,
            maxAge: 60 * 15 // 15 minutes
        });

        // Refresh Token - Long lived if rememberMe is true
        if (result.refreshToken) {
            response.cookies.set('refreshToken', result.refreshToken, {
                ...cookieOptions,
                maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined // 30 days or session
            });
        }

        return response;
    } catch (error) {
        console.error('2FA Verify Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}
