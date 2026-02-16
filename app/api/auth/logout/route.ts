import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { verifyAuth } from '@/backend/middleware/authMiddleware';

export async function POST(req: NextRequest) {
    // 1. Identify user to revoke session in DB
    const user = await verifyAuth(req);
    if (user) {
        await AuthService.logout(user.id);
    }

    // 2. Clear cookies
    const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully'
    }, { status: 200 });

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
}
