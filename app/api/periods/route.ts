import { NextRequest, NextResponse } from 'next/server';
import { periodRoutes } from '@/backend/routes/periods';
import { requireRole } from '@/backend/middleware/roleMiddleware';

export async function GET(req: NextRequest) {
    // GET -> admin, teacher
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized) return auth.response;

    const result = await periodRoutes.getAll();
    if (result.status >= 400) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    // POST -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const result = await periodRoutes.create(body);
        if (result.status >= 400) {
            return NextResponse.json({ error: result.error || result.errors }, { status: result.status });
        }
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
