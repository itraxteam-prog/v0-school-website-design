import { NextRequest, NextResponse } from 'next/server';
import { SubjectService } from '@/backend/services/subjectService';
import { requireRole } from '@/backend/middleware/roleMiddleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const subjects = await SubjectService.getAll();
        return NextResponse.json(subjects);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireRole(request, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await request.json();
        const subject = await SubjectService.create(body);
        return NextResponse.json(subject, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
