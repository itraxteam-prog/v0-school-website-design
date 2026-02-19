export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { TwoFactorService } from '@/backend/services/twoFactorService';
import { verifyAuth } from '@/backend/middleware/authMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return createErrorResponse('Unauthorized', 401);
        }

        const data = await TwoFactorService.setup2FA(user.id);
        if (!data) {
            return createErrorResponse('Failed to setup 2FA', 500);
        }

        return createSuccessResponse({
            secret: data.secret,
            qrCode: data.qrCode
        });
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

