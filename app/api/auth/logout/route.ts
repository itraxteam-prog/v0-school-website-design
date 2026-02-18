import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { verifyAuth } from '@/backend/middleware/authMiddleware';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        // 1. Identify user to revoke session in DB
        const user = await verifyAuth(req);
        if (user) {
            await AuthService.logout(user.id);
            LogService.logAction(user.id, user.role, 'LOGOUT', 'AUTH', undefined, 'success', metadata);
        }

        // 2. Clear cookies
        const response = createResponse({ message: 'Logged out successfully' }, 200);

        const clearOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/',
            maxAge: 0
        };

        response.cookies.set('token', '', clearOptions);
        response.cookies.set('refreshToken', '', clearOptions);

        return response;
    } catch (error) {
        console.error('Logout Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}
