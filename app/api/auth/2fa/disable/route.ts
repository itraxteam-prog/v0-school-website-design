import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { verifyJWT } from '@/backend/utils/auth';

export async function POST(req: NextRequest) {
    try {
        const payload = verifyJWT(req);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { password } = await req.json();
        const result = await AuthService.disable2FA(payload.id, password);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
