import { NextRequest } from 'next/server';
import { announcementController } from '@/backend/controllers/announcements';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { validateBody, AnnouncementSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // GET -> all roles
        const auth = await requireRole(req, ['admin', 'teacher', 'student', 'parent']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await announcementController.getById(params.id, auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Announcement not found', result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ', 'ANNOUNCEMENT', params.id, 'success');
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // PUT -> admin and teacher (backend checks permissions)
        const auth = await requireRole(req, ['admin', 'teacher']);
        if (!auth.authorized || !auth.user) return auth.response;

        const body = await req.json();

        // Validation Guard
        const { data, error } = await validateBody(AnnouncementSchema.partial(), body);
        if (error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'ANNOUNCEMENT', params.id, 'failure', { error });
            return createErrorResponse(error, 400);
        }

        const result = await announcementController.update(params.id, data!, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'ANNOUNCEMENT', params.id, 'failure', { error: result.error });
            return createErrorResponse(result.error || 'Update failed', result.status);
        }
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'ANNOUNCEMENT', params.id, 'success');
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // DELETE -> admin only
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await announcementController.delete(params.id, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'ANNOUNCEMENT', params.id, 'failure', { error: result.error });
            return createErrorResponse(result.error || 'Delete failed', result.status);
        }
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'ANNOUNCEMENT', params.id, 'success');
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
