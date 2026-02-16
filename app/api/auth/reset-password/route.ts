import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
        }

        const result = await authRoutes.resetPassword(token, newPassword);

        if (result.status >= 400) {
            return NextResponse.json({
                success: false,
                message: result.error || 'Failed to reset password'
            }, { status: result.status });
        }

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
