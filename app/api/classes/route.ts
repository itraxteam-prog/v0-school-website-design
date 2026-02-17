import { NextRequest, NextResponse } from 'next/server';
import { classRoutes } from '@/backend/routes/classes';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { validateBody, ClassSchema } from '@/backend/validation/schemas';

export async function GET(req: NextRequest) {
    // GET -> admin, teacher, student
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    const result = await classRoutes.getAll(auth.user);
    if (result.status >= 400) {
        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'CLASS', undefined, 'failure', { error: result.error });
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'CLASS', undefined, 'success');
    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    // POST -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(ClassSchema, body);
        if (validation.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'CLASS', undefined, 'failure', { error: validation.error });
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await classRoutes.create(validation.data, auth.user);
        if (result.status >= 400) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'CLASS', undefined, 'failure', { error: result.error || result.errors });
            return NextResponse.json({ error: result.error || result.errors }, { status: result.status });
        }

        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'CLASS', (result.data as any)?.id, 'success', result.data);
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
