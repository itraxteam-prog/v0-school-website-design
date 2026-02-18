import { NextRequest } from 'next/server';
import { teacherController } from '@/backend/controllers/teachers';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AuditService } from '@/backend/services/auditService';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';
import { validateBody, TeacherSchema } from '@/backend/validation/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin', 'teacher']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await teacherController.getById(params.id, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'READ', 'TEACHER', params.id, 'failure', { error: result.error });
            return createErrorResponse(result.error || 'Teacher not found', result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ', 'TEACHER', params.id, 'success');
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';
        const metadata = { ip, userAgent, targetTeacherId: params.id };

        const body = await req.json();

        // Validation Guard
        const { data, error } = await validateBody(TeacherSchema.partial(), body);
        if (error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'TEACHER', params.id, 'failure', { error, metadata });
            return createErrorResponse(error, 400);
        }

        const result = await teacherController.update(params.id, data!, auth.user);
        if (result.status >= 400) {
            await AuditService.logUserUpdate(auth.user.id, 'failure', { ...metadata, error: result.error });
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'TEACHER', params.id, 'failure', { error: result.error, metadata });
            return createErrorResponse(result.error || 'Update failed', result.status);
        }
        await AuditService.logUserUpdate(auth.user.id, 'success', metadata);
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'TEACHER', params.id, 'success', metadata);
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';
        const metadata = { ip, userAgent, targetTeacherId: params.id };

        const result = await teacherController.delete(params.id, auth.user);
        if (result.status >= 400) {
            await AuditService.logEvent(auth.user.id, 'DELETE_TEACHER', 'failure', { ...metadata, error: result.error });
            LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'TEACHER', params.id, 'failure', { error: result.error, metadata });
            return createErrorResponse(result.error || 'Delete failed', result.status);
        }
        await AuditService.logEvent(auth.user.id, 'DELETE_TEACHER', 'success', metadata);
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'TEACHER', params.id, 'success', metadata);
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
