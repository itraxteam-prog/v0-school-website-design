export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { LoginService } from '@/backend/services/loginService';
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

        const result = await LoginService.forgotPassword(email);

        return createSuccessResponse({
            message: result.message || 'Password reset link sent',
            resetLink: result.resetLink // Strictly for development/demo purposes
        });
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

