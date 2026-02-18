import { NextRequest } from 'next/server';
import { periodController } from '@/backend/controllers/periods';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    // GET -> admin, teacher
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const result = await periodController.getAll(auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error, result.status);
        }

        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function POST(req: NextRequest) {
    // POST -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        console.log('API POST /api/periods - Request Body:', body);

        const result = await periodController.create(body, auth.user);
        if (result.status >= 400) {
            console.error('API POST /api/periods - Route Error:', result.error || result.errors);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'PERIOD', undefined, 'failure', { error: result.error || result.errors });
            return createErrorResponse(result.error || result.errors, result.status);
        }

        console.log('API POST /api/periods - Success:', (result.data as any)?.id);
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'PERIOD', (result.data as any)?.id, 'success', result.data);

        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        console.error('API POST /api/periods - Internal Error:', error);
        return createErrorResponse(error.message || 'Failed to process period creation', 500);
    }
}
