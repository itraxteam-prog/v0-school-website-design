export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { classController } from '@/backend/controllers/classes';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { validateBody, ClassSchema } from '@/backend/validation/schemas';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin', 'teacher', 'student']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await classController.getById(params.id, auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Class not found', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const body = await req.json();

        // Validation Guard
        const { data, error } = await validateBody(ClassSchema.partial(), body);
        if (error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'CLASS', params.id, 'failure', { error });
            return createErrorResponse(error, 400);
        }

        const result = await classController.update(params.id, data!, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'CLASS', params.id, 'failure', { error: result.error });
            return createErrorResponse(result.error || 'Update failed', result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'CLASS', params.id, 'success');
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await classController.delete(params.id, auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Delete failed', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
