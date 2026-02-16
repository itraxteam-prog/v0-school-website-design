import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from '@/backend/services/authService';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            // No access token - return 401 to trigger refresh flow in client
            return NextResponse.json({ user: null, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = AuthService.verifyToken(token);

        if (!decoded) {
            // Invalid or expired access token - return 401
            return NextResponse.json({ user: null, message: 'Invalid or expired token' }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email,
                name: decoded.name
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ user: null, message: 'Error verifying session' }, { status: 500 });
    }
}
