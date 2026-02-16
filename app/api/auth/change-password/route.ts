import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';
import { verifyJWT } from '@/backend/utils/auth';

export async function POST(req: NextRequest) {
    try {
        const payload = verifyJWT(req);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const result = await authRoutes.changePassword(payload.id, currentPassword, newPassword);

        if (result.status >= 400) {
            return NextResponse.json({
                success: false,
                message: result.error || 'Failed to change password'
            }, { status: result.status });
        }

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
