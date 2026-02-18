import { NextRequest } from 'next/server';
import { teacherController } from '@/backend/controllers/teachers';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { NotificationService } from '@/backend/services/notificationService';
import { validateBody, TeacherSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const result = await teacherController.getAll(auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'TEACHER', undefined, 'failure', { error: result.error });
            return createErrorResponse(result.error, result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'TEACHER', undefined, 'success');
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        console.log('API POST /api/teachers - Request Body:', body);

        // Validation Guard
        const validation = await validateBody(TeacherSchema, body);
        if (validation.error) {
            console.error('API POST /api/teachers - Validation Failed:', validation.error);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'TEACHER', undefined, 'failure', { error: validation.error });
            return createErrorResponse(validation.error, 400);
        }

        const result = await teacherController.create(validation.data, auth.user);
        if (result.status >= 400) {
            console.error('API POST /api/teachers - Route Error:', result.error || result.errors);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'TEACHER', undefined, 'failure', { error: result.error || result.errors });
            return createErrorResponse(result.error || result.errors, result.status);
        }

        const newTeacher = result.data as any;
        console.log('API POST /api/teachers - Success:', newTeacher?.id);
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'TEACHER', newTeacher?.id, 'success', result.data);

        // Welcome notification
        try {
            NotificationService.sendEmailNotification(newTeacher.id, 'WELCOME', `Welcome to Pioneers High, ${newTeacher.name}! Your teacher account has been created.`, 'teacher');
        } catch (notifyError) {
            console.error('Failed to send teacher welcome notification:', notifyError);
        }

        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        console.error('API POST /api/teachers - Internal Error:', error);
        return createErrorResponse(error.message || 'Failed to process teacher creation', 500);
    }
}
