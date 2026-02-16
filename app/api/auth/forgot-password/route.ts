import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const result = await authRoutes.forgotPassword(email);

        return NextResponse.json({
            success: true,
            message: result.data?.message || 'Password reset link sent',
            resetLink: result.data?.resetLink // Strictly for development/demo purposes
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
