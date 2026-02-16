import { NextRequest, NextResponse } from 'next/server';
import { roleRoutes } from '@/backend/routes/roles';
import { requireRole } from '@/backend/middleware/roleMiddleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // GET -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    const result = await roleRoutes.getById(params.id);
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
        const result = await roleRoutes.update(params.id, body);
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

    const result = await roleRoutes.delete(params.id);
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}
