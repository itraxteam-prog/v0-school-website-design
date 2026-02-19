export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { UserService } from '@/backend/services/userService';
import { LoginService } from '@/backend/services/loginService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';
import { validateBody, RegisterSchema } from '@/backend/validation/schemas';
import { LogService } from '@/backend/services/logService';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const users = await UserService.getAll();
        return createSuccessResponse(users);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Failed to fetch users', 500);
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        console.log('API POST /api/users - Request Body:', { ...body, password: '[REDACTED]' });

        // Validate
        const validation = await validateBody(RegisterSchema, body);
        if (validation.error) {
            console.error('API POST /api/users - Validation Failed:', validation.error);
            return createErrorResponse(validation.error, 400);
        }

        // Use AuthService to handle hashing and user creation
        const result = await LoginService.register(validation.data);

        if (!result.success) {
            console.error('API POST /api/users - LoginService Error:', result.message);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'USER', undefined, 'failure', { error: result.message });
            return createErrorResponse(result.message || 'Failed to create user', 400);
        }

        console.log('API POST /api/users - Success:', (result.user as any)?.id);
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'USER', (result.user as any)?.id, 'success');

        return createSuccessResponse(result.user, 201);

    } catch (error: any) {
        console.error('API POST /api/users - Internal Error:', error);
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
