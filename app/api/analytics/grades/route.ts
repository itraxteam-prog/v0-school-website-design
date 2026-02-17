import { NextRequest, NextResponse } from 'next/server';
import { AcademicService } from '@/backend/services/academicService';
import { requireRole } from '@/backend/utils/auth';

export async function GET(request: NextRequest) {
    const authError = await requireRole(request, ['admin', 'teacher']);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || undefined;

    try {
        const distribution = await AcademicService.getGradeDistribution(classId);
        return NextResponse.json(distribution);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
