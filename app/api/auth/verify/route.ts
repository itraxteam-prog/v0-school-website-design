export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SessionService } from '@/backend/services/sessionService';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';



export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            // No access token - return 401 to trigger refresh flow in client
            return createErrorResponse('Authentication required', 401);
        }

        const decoded = await SessionService.verifyToken(token);

        if (!decoded) {
            // Invalid or expired access token - return 401
            return createErrorResponse('Invalid or expired token', 401);
        }

        const userData = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email,
            name: decoded.name
        };

        return createResponse({ user: userData }, 200);
    } catch (error) {
        console.error('Verify Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}

