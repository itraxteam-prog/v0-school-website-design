import { NextRequest } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';
import { createResponse, createErrorResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return createErrorResponse('Invalid JSON body', 400);
        }

        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return createErrorResponse('Invalid request: Token and new password are required', 400);
        }

        const result = await authRoutes.resetPassword(token, newPassword);

        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Failed to reset password', result.status);
        }

        return createResponse({ message: 'Password reset successfully' }, 200);
    } catch (error) {
        console.error('Reset Password Route Error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}
