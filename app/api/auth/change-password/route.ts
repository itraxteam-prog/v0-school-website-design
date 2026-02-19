export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { LoginService } from '@/backend/services/loginService';
import { verifyAuth } from '@/backend/middleware/authMiddleware';
import { validateBody, ChangePasswordSchema } from '@/backend/validation/schemas';
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

        // Validation Guard
        const validation = await validateBody(ChangePasswordSchema, body);
        if (validation.error) {
            return createErrorResponse(validation.error, 400);
        }

        const { currentPassword, newPassword } = validation.data!;

        const result = await LoginService.changePassword(user.id, currentPassword, newPassword);

        if (!result.success) {
            return createErrorResponse(result.message || 'Failed to change password', 400);
        }

        return createSuccessResponse(null, 200, 'Password changed successfully');
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

