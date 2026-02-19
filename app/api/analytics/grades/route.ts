export const runtime = 'nodejs'export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { AcademicService } from '@/backend/services/academicService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const auth = await requireRole(request, ['admin', 'teacher']);
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || undefined;

    try {
        const distribution = await AcademicService.getGradeDistribution(classId);
        return createSuccessResponse(distribution);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

