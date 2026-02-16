import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return createErrorResponse('Invalid JSON body', 400);
        }

        const { email, password, rememberMe } = body;

        if (!email || !password) {
            return createErrorResponse('Email and password are required', 400);
        }

        const result = await AuthService.login(email, password);

        if (result.error) {
            // Log failed login
            LogService.logAction('system', 'guest', 'LOGIN_ATTEMPT', 'AUTH', undefined, 'failure', { ...metadata, email, error: result.error });
            return createErrorResponse(result.error, result.status || 401);
        }

        // Handle 2FA Required
        if (result.requires2FA) {
            LogService.logAction('system', 'guest', 'LOGIN_2FA_REQUIRED', 'AUTH', undefined, 'success', { ...metadata, email });
            return createResponse({ requires2FA: true, tempToken: result.tempToken }, 202);
        }

        if (!result.token) {
            LogService.logAction('system', 'guest', 'LOGIN_ATTEMPT', 'AUTH', undefined, 'failure', { ...metadata, email, error: 'No token generated' });
            return createErrorResponse('Authentication failed', 401);
        }

        // Log successful login
        if (result.user?.id) {
            LogService.logAction(result.user.id, result.user.role, 'LOGIN', 'AUTH', undefined, 'success', metadata);
        }

        // Create response with user data
        const userData = {
            id: result.user?.id,
            name: result.user?.name,
            role: result.user?.role,
            email: result.user?.email
        };

        const response = createResponse({ user: userData }, 200);

        // Cookie options for security
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
    } catch (error: any) {
        console.error('Login Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}
