import { NextRequest, NextResponse } from 'next/server';
import { teacherRoutes } from '@/backend/routes/teachers';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AuditService } from '@/backend/services/auditService';
import { LogService } from '@/backend/services/logService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await teacherRoutes.getById(params.id, auth.user);
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'READ', 'TEACHER', params.id, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ', 'TEACHER', params.id, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent, targetTeacherId: params.id };

    try {
        const body = await req.json();
        const result = await teacherRoutes.update(params.id, body, auth.user);
        if (result.status >= 400) {
            await AuditService.logUserUpdate(auth.user.id, 'failure', { ...metadata, error: result.error });
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'TEACHER', params.id, 'failure', { error: result.error, metadata });
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        await AuditService.logUserUpdate(auth.user.id, 'success', metadata);
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'TEACHER', params.id, 'success', metadata);
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent, targetTeacherId: params.id };

    const result = await teacherRoutes.delete(params.id, auth.user);
    if (result.status >= 400) {
        await AuditService.logEvent(auth.user.id, 'DELETE_TEACHER', 'failure', { ...metadata, error: result.error });
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'TEACHER', params.id, 'failure', { error: result.error, metadata });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await AuditService.logEvent(auth.user.id, 'DELETE_TEACHER', 'success', metadata);
    LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'TEACHER', params.id, 'success', metadata);
    return NextResponse.json(result.data, { status: result.status });
}
