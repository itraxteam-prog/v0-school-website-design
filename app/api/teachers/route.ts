import { NextRequest, NextResponse } from 'next/server';
import { teacherRoutes } from '@/backend/routes/teachers';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { NotificationService } from '@/backend/services/notificationService';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await teacherRoutes.getAll(auth.user);
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'TEACHER', undefined, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'TEACHER', undefined, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        const result = await teacherRoutes.create(body, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'TEACHER', undefined, 'failure', { error: result.error || result.errors });
            return NextResponse.json({ error: result.error || result.errors }, { status: result.status });
        }

        const newTeacher = result.data as any;
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'TEACHER', newTeacher?.id, 'success', result.data);

        // Welcome notification
        NotificationService.sendEmailNotification(newTeacher.id, 'WELCOME', `Welcome to Pioneers High, ${newTeacher.name}! Your teacher account has been created.`, 'teacher');

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
