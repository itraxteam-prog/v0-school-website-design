export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { TwoFactorService } from '@/backend/services/twoFactorService';
import { AuditService } from '@/backend/services/auditService';
import { verifyAuth } from '@/backend/middleware/authMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        const user = await verifyAuth(req);
        if (!user) {
            return createErrorResponse('Unauthorized', 401);
        }

        const body = await req.json();
        const { code } = body;
        if (!code) {
            return createErrorResponse('Verification code is required', 400);
        }

        const result = await TwoFactorService.verifyAndEnable2FA(user.id, code);
        if (!result.success) {
            await AuditService.log2FASetup(user.id, 'ENABLE', 'failure', { ...metadata, error: result.message });
            return createErrorResponse(result.message || 'Failed to enable 2FA', 400);
        }

        await AuditService.log2FASetup(user.id, 'ENABLE', 'success', metadata);

        return createSuccessResponse({
            message: result.message,
            recoveryCodes: result.recoveryCodes
        });
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

