export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { LoginService } from '@/backend/services/loginService';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';
import { validateBody, ResetPasswordSchema } from '@/backend/validation/schemas';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(ResetPasswordSchema, body);
        if (validation.error) {
            return createErrorResponse(validation.error, 400);
        }

        const { token, newPassword } = validation.data!;
        const result = await LoginService.resetPassword(token, newPassword);

        if (!result.success) {
            return createErrorResponse(result.message || 'Failed to reset password', 400);
        }

        return createResponse({ message: 'Password reset successfully' }, 200);
    } catch (error) {
        console.error('Reset Password Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}

