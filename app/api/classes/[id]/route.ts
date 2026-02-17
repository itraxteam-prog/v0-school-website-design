import { NextRequest, NextResponse } from 'next/server';
import { classRoutes } from '@/backend/routes/classes';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { validateBody, ClassSchema } from '@/backend/validation/schemas';
import { LogService } from '@/backend/services/logService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await classRoutes.getById(params.id, auth.user);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(ClassSchema.partial(), body);
        if (validation.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'CLASS', params.id, 'failure', { error: validation.error });
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await classRoutes.update(params.id, validation.data, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'CLASS', params.id, 'failure', { error: result.error });
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'CLASS', params.id, 'success');
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await classRoutes.delete(params.id, auth.user);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}
