import { NextRequest, NextResponse } from 'next/server';
import { AcademicService } from '@/backend/services/academicService';
import { requireRole } from '@/backend/middleware/roleMiddleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const auth = await requireRole(request, ['admin', 'teacher']);
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || undefined;

    try {
        const distribution = await AcademicService.getGradeDistribution(classId);
        return NextResponse.json(distribution);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
