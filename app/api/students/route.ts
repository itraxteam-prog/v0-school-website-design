import { NextRequest } from 'next/server';
import { studentController } from '@/backend/controllers/students';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { NotificationService } from '@/backend/services/notificationService';
import { validateBody, StudentSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    // GET -> admin, teacher, student
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const result = await studentController.getAll(auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'STUDENT', undefined, 'failure', { error: result.error });
            return createErrorResponse(result.error, result.status);
        }

        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'STUDENT', undefined, 'success');
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
        console.log('API POST /api/students - Request Body:', body);

        // Validation Guard
        const validation = await validateBody(StudentSchema, body);
        if (validation.error) {
            console.error('API POST /api/students - Validation Failed:', validation.error);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'STUDENT', undefined, 'failure', { error: validation.error });
            return createErrorResponse(validation.error, 400);
        }

        const result = await studentController.create(validation.data, auth.user);
        if (result.status >= 400) {
            console.error('API POST /api/students - Route Error:', result.error || result.errors);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'STUDENT', undefined, 'failure', { error: result.error || result.errors });
            return createErrorResponse(result.error || result.errors, result.status);
        }

        const newStudent = result.data as any;
        console.log('API POST /api/students - Success:', newStudent?.id);
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'STUDENT', newStudent?.id, 'success', result.data);

        // Welcome notification
        try {
            NotificationService.sendEmailNotification(newStudent.id, 'WELCOME', `Welcome to Pioneers High, ${newStudent.name}! Your account has been created.`, 'student');
        } catch (notifyError) {
            console.error('Failed to send student welcome notification:', notifyError);
        }

        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        console.error('API POST /api/students - Internal Error:', error);
        return createErrorResponse(error.message || 'Failed to process student creation', 500);
    }
}
