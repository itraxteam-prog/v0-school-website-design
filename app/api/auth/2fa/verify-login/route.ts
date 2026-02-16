import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';

export async function POST(req: NextRequest) {
    try {
        const { tempToken, code, rememberMe } = await req.json();

        if (!tempToken || !code) {
            return NextResponse.json({ success: false, message: 'Session and code are required' }, { status: 400 });
        }

        const result = await AuthService.verify2FALogin(tempToken, code);

        if (result.error || !result.token) {
            return NextResponse.json({
                success: false,
                message: result.error || 'Verification failed'
            }, { status: result.status || 401 });
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            user: {
                id: result.user?.id,
                name: result.user?.name,
                role: result.user?.role,
                email: result.user?.email
            }
        }, { status: 200 });

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
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'An internal error occurred'
        }, { status: 500 });
    }
}
