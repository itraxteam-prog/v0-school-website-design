import { NextRequest, NextResponse } from 'next/server';
import { announcementRoutes } from '@/backend/routes/announcements';
import { requireRole } from '@/backend/middleware/roleMiddleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // GET -> all roles (admin, teacher, student, parent)
    const auth = await requireRole(req, ['admin', 'teacher', 'student', 'parent']);
    if (!auth.authorized) return auth.response;

    const result = await announcementRoutes.getById(params.id);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // PUT -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const result = await announcementRoutes.update(params.id, body);
        if (result.status >= 400) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // DELETE -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    const result = await announcementRoutes.delete(params.id);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}
