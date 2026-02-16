import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
        return NextResponse.json({ success: false, message: 'No refresh token provided' }, { status: 401 });
    }

    const result = await AuthService.refreshSession(refreshToken);

    if (!result) {
        // Refresh token is invalid or expired or revoked
        const response = NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
        response.cookies.delete('token');
        response.cookies.delete('refreshToken');
        return response;
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

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
}
