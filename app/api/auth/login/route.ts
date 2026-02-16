import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await authRoutes.login(body);

        if (result.status >= 400) {
            return NextResponse.json({
                success: false,
                message: result.error || 'Invalid credentials'
            }, { status: result.status });
        }

        // Create response with success data
        const response = NextResponse.json({
            success: true,
            role: result.data.user.role,
            name: result.data.user.email // or use a name field if available
        }, { status: result.status });

        // Set HTTP-only, secure cookie
        response.cookies.set('token', result.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to parse request body'
        }, { status: 400 });
    }
}
