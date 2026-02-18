import { NextRequest } from 'next/server';
import { studentController } from '@/backend/controllers/students';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AuditService } from '@/backend/services/auditService';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';
import { validateBody, StudentSchema } from '@/backend/validation/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // GET -> admin, teacher, student
        const auth = await requireRole(req, ['admin', 'teacher', 'student']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await studentController.getById(params.id, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'READ', 'STUDENT', params.id, 'failure', { error: result.error });
            return createErrorResponse(result.error || 'Student not found', result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ', 'STUDENT', params.id, 'success');
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // PUT -> admin only
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';
        const metadata = { ip, userAgent, targetStudentId: params.id };

        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(StudentSchema.partial(), body);
        if (validation.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'STUDENT', params.id, 'failure', { error: validation.error, metadata });
            return createErrorResponse(validation.error, 400);
        }

        const result = await studentController.update(params.id, validation.data, auth.user);
        if (result.status >= 400) {
            await AuditService.logUserUpdate(auth.user.id, 'failure', { ...metadata, error: result.error });
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'STUDENT', params.id, 'failure', { error: result.error, metadata });
            return createErrorResponse(result.error || 'Update failed', result.status);
        }
        await AuditService.logUserUpdate(auth.user.id, 'success', metadata);
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'STUDENT', params.id, 'success', metadata);
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

        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';
        const metadata = { ip, userAgent, targetStudentId: params.id };

        const result = await studentController.delete(params.id, auth.user);
        if (result.status >= 400) {
            await AuditService.logEvent(auth.user.id, 'DELETE_STUDENT', 'failure', { ...metadata, error: result.error });
            LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'STUDENT', params.id, 'failure', { error: result.error, metadata });
            return createErrorResponse(result.error || 'Delete failed', result.status);
        }
        await AuditService.logEvent(auth.user.id, 'DELETE_STUDENT', 'success', metadata);
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'STUDENT', params.id, 'success', metadata);
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
