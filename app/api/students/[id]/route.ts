import { NextRequest, NextResponse } from 'next/server';
import { studentRoutes } from '@/backend/routes/students';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AuditService } from '@/backend/services/auditService';
import { LogService } from '@/backend/services/logService';
import { validateBody, StudentSchema } from '@/backend/validation/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // GET -> admin, teacher, student
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await studentRoutes.getById(params.id, auth.user);
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'READ', 'STUDENT', params.id, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ', 'STUDENT', params.id, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // PUT -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent, targetStudentId: params.id };

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(StudentSchema.partial(), body);
        if (validation.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'STUDENT', params.id, 'failure', { error: validation.error, metadata });
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await studentRoutes.update(params.id, validation.data, auth.user);
        if (result.status >= 400) {
            await AuditService.logUserUpdate(auth.user.id, 'failure', { ...metadata, error: result.error });
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'STUDENT', params.id, 'failure', { error: result.error, metadata });
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        await AuditService.logUserUpdate(auth.user.id, 'success', metadata);
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'STUDENT', params.id, 'success', metadata);
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // DELETE -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent, targetStudentId: params.id };

    const result = await studentRoutes.delete(params.id, auth.user);
    if (result.status >= 400) {
        await AuditService.logEvent(auth.user.id, 'DELETE_STUDENT', 'failure', { ...metadata, error: result.error });
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'STUDENT', params.id, 'failure', { error: result.error, metadata });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await AuditService.logEvent(auth.user.id, 'DELETE_STUDENT', 'success', metadata);
    LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'STUDENT', params.id, 'success', metadata);
    return NextResponse.json(result.data, { status: result.status });
}
