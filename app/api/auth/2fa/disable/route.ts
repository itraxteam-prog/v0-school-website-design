import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/authService';
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

        const { password } = await req.json();
        const result = await AuthService.disable2FA(user.id, password);

        if (!result.success) {
            await AuditService.log2FASetup(user.id, 'DISABLE', 'failure', { ...metadata, error: result.message });
            return createErrorResponse(result.message || 'Failed to disable 2FA', 400);
        }

        await AuditService.log2FASetup(user.id, 'DISABLE', 'success', metadata);

        return createSuccessResponse({
            message: result.message
        });
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
