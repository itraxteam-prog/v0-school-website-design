import { NextRequest } from 'next/server';
import { classController } from '@/backend/controllers/classes';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { validateBody, ClassSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    // GET -> admin, teacher, student
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const result = await classController.getAll(auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'CLASS', undefined, 'failure', { error: result.error });
            return createErrorResponse(result.error, result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'CLASS', undefined, 'success');
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(req: NextRequest) {
    // POST -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        console.log('API POST /api/classes - Request Body:', body);

        // Validation Guard
        const validation = await validateBody(ClassSchema, body);
        if (validation.error) {
            console.error('API POST /api/classes - Validation Failed:', validation.error);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'CLASS', undefined, 'failure', { error: validation.error });
            return createErrorResponse(validation.error, 400);
        }

        const result = await classController.create(validation.data, auth.user);
        if (result.status >= 400) {
            console.error('API POST /api/classes - Route Error:', result.error || result.errors);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'CLASS', undefined, 'failure', { error: result.error || result.errors });
            return createErrorResponse(result.error || result.errors, result.status);
        }

        console.log('API POST /api/classes - Success:', (result.data as any)?.id);
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'CLASS', (result.data as any)?.id, 'success', result.data);

        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        console.error('API POST /api/classes - Internal Error:', error);
        return createErrorResponse(error.message || 'Failed to process class creation', 500);
    }
}
