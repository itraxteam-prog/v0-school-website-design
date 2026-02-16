import { NextRequest, NextResponse } from 'next/server';
import { studentRoutes } from '@/backend/routes/students';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { NotificationService } from '@/backend/services/notificationService';

export async function GET(req: NextRequest) {
    // GET -> admin, teacher
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await studentRoutes.getAll();
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'STUDENT', undefined, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'STUDENT', undefined, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    // POST -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        const result = await studentRoutes.create(body);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'STUDENT', undefined, 'failure', { error: result.error || result.errors });
            return NextResponse.json({ error: result.error || result.errors }, { status: result.status });
        }

        const newStudent = result.data as any;
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'STUDENT', newStudent?.id, 'success', result.data);

        // Welcome notification
        NotificationService.sendEmailNotification(newStudent.id, 'WELCOME', `Welcome to Pioneers High, ${newStudent.name}! Your account has been created.`, 'student');

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
