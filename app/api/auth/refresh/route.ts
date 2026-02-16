import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return createErrorResponse('No refresh token provided', 401);
        }

        const result = await AuthService.refreshSession(refreshToken);

        if (!result) {
            // Refresh token is invalid or expired or revoked
            const response = createErrorResponse('Invalid refresh token', 401);
            response.cookies.delete('token');
            response.cookies.delete('refreshToken');
            return response;
        }

        const response = createResponse({ success: true }, 200);

        const cookieOptions: any = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        };

        // Update both tokens (rolling refresh)
        response.cookies.set('token', result.token, {
            ...cookieOptions,
            maxAge: 60 * 15 // 15 minutes
        });

        response.cookies.set('refreshToken', result.refreshToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return response;
    } catch (error) {
        console.error('Refresh Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}
