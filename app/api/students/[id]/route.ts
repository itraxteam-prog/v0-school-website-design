import { NextRequest, NextResponse } from 'next/server';
import { studentRoutes } from '@/backend/routes/students';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AuditService } from '@/backend/services/auditService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // GET -> admin, teacher
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized) return auth.response;

    const result = await studentRoutes.getById(params.id);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
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
        const result = await studentRoutes.update(params.id, body);
        if (result.status >= 400) {
            await AuditService.logUserUpdate(auth.user.id, 'failure', { ...metadata, error: result.error });
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        await AuditService.logUserUpdate(auth.user.id, 'success', metadata);
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

    const result = await studentRoutes.delete(params.id);
    if (result.status >= 400) {
        await AuditService.logEvent(auth.user.id, 'DELETE_STUDENT', 'failure', { ...metadata, error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await AuditService.logEvent(auth.user.id, 'DELETE_STUDENT', 'success', metadata);
    return NextResponse.json(result.data, { status: result.status });
}
