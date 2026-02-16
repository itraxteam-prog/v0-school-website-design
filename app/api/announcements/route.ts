import { NextRequest, NextResponse } from 'next/server';
import { announcementRoutes } from '@/backend/routes/announcements';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';

export async function GET(req: NextRequest) {
    // GET -> all roles (admin, teacher, student, parent)
    const auth = await requireRole(req, ['admin', 'teacher', 'student', 'parent']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await announcementRoutes.getAll();
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'ANNOUNCEMENT', undefined, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'ANNOUNCEMENT', undefined, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    // POST -> admin and teacher
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        const result = await announcementRoutes.create(body);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'ANNOUNCEMENT', undefined, 'failure', { error: result.error || result.errors });
            return NextResponse.json({ error: result.error || result.errors }, { status: result.status });
        }

        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'ANNOUNCEMENT', (result.data as any)?.id, 'success', result.data);
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
