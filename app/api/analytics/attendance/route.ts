import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/backend/services/attendanceService';
import { requireRole } from '@/backend/middleware/roleMiddleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const auth = await requireRole(request, ['admin', 'teacher']);
    if (!auth.authorized) return auth.response;

    try {
        const stats = await AttendanceService.getInstitutionalAttendanceStats();
        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
