import { NextRequest } from 'next/server';
import { AttendanceService } from '@/backend/services/attendanceService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const auth = await requireRole(request, ['admin', 'teacher']);
    if (!auth.authorized) return auth.response;

    try {
        const stats = await AttendanceService.getInstitutionalAttendanceStats();
        return createSuccessResponse(stats);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}
