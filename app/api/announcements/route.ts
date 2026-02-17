import { NextRequest } from 'next/server';
import { announcementRoutes } from '@/backend/routes/announcements';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { validateBody, AnnouncementSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    // GET -> all roles (admin, teacher, student, parent)
    const auth = await requireRole(req, ['admin', 'teacher', 'student', 'parent']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const result = await announcementRoutes.getAll(auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'ANNOUNCEMENT', undefined, 'failure', { error: result.error });
            return createErrorResponse(result.error, result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'ANNOUNCEMENT', undefined, 'success');
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(req: NextRequest) {
    // POST -> admin and teacher (backend checks permissions)
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(AnnouncementSchema, body);
        if (validation.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'ANNOUNCEMENT', undefined, 'failure', { error: validation.error });
            return createErrorResponse(validation.error, 400);
        }

        const result = await announcementRoutes.create(validation.data, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'ANNOUNCEMENT', undefined, 'failure', { error: result.error || result.errors });
            return createErrorResponse(result.error || result.errors, result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'ANNOUNCEMENT', (result.data as any)?.id, 'success', result.data);
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse('Failed to parse request body', 400);
    }
}
