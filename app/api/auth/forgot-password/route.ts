import { NextRequest } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';
import { validateBody, EmailOnlySchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validation Guard
        const { data, error } = await validateBody(EmailOnlySchema, body);
        if (error) {
            return createErrorResponse(error, 400);
        }

        const { email } = data!;

        const result = await authRoutes.forgotPassword(email);

        return createSuccessResponse({
            message: result.data?.message || 'Password reset link sent',
            resetLink: result.data?.resetLink // Strictly for development/demo purposes
        });
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
