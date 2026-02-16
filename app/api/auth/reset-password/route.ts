import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';
import { AuditService } from '@/backend/services/auditService';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        const body = await req.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
        }

        const result = await authRoutes.resetPassword(token, newPassword);

        if (result.status >= 400) {
            await AuditService.logPasswordChange('token_reset', 'failure', { ...metadata, error: result.error });
            return NextResponse.json({
                success: false,
                message: result.error || 'Failed to reset password'
            }, { status: result.status });
        }

        await AuditService.logPasswordChange('token_reset', 'success', metadata);

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
