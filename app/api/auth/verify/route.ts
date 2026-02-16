import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from '@/backend/services/authService';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = AuthService.verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({
            user: {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
