import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { verifyJWT } from '@/backend/utils/auth';

export async function POST(req: NextRequest) {
    try {
        const payload = verifyJWT(req);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const data = await AuthService.setup2FA(payload.id);
        if (!data) {
            return NextResponse.json({ success: false, message: 'Failed to setup 2FA' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            secret: data.secret,
            qrCode: data.qrCode
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
