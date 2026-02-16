import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { AuditService } from '@/backend/services/auditService';
import { verifyJWT } from '@/backend/utils/auth';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        const payload = verifyJWT(req);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { password } = await req.json();
        const result = await AuthService.disable2FA(payload.id, password);

        if (!result.success) {
            await AuditService.log2FASetup(payload.id, 'DISABLE', 'failure', { ...metadata, error: result.message });
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        await AuditService.log2FASetup(payload.id, 'DISABLE', 'success', metadata);

        return NextResponse.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
