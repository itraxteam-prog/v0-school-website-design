import { NextRequest, NextResponse } from 'next/server';
import { announcementRoutes } from '@/backend/routes/announcements';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { validateBody, AnnouncementSchema } from '@/backend/validation/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // GET -> all roles
    const auth = await requireRole(req, ['admin', 'teacher', 'student', 'parent']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await announcementRoutes.getById(params.id, auth.user);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ', 'ANNOUNCEMENT', params.id, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // PUT -> admin and teacher (backend checks permissions)
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(AnnouncementSchema.partial(), body);
        if (validation.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'ANNOUNCEMENT', params.id, 'failure', { error: validation.error });
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await announcementRoutes.update(params.id, validation.data, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'ANNOUNCEMENT', params.id, 'failure', { error: result.error });
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'ANNOUNCEMENT', params.id, 'success');
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // DELETE -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await announcementRoutes.delete(params.id, auth.user);
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'ANNOUNCEMENT', params.id, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'ANNOUNCEMENT', params.id, 'success');
    return NextResponse.json(result.data, { status: result.status });
}
