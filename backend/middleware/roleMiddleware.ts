import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, AuthPayload } from './authMiddleware';

// Utility to check role permissions
export async function requireRole(req: NextRequest | Request, allowedRoles: string[]) {
    const user = await verifyAuth(req);

    if (!user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        };
    }

    if (!allowedRoles.includes(user.role)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: 'Forbidden: Insufficient permissions' },
                { status: 403 }
            )
        };
    }

    return {
        authorized: true,
        user
    };
}
