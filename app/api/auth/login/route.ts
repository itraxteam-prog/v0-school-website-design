import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await authRoutes.login(body);

        if (result.status >= 400) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        // Create response with JSON data
        const response = NextResponse.json(result.data, { status: result.status });

        // Set HTTP-only cookie
        response.cookies.set('token', result.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
