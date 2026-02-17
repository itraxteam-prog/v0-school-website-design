import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/backend/services/attendanceService';
import { requireRole } from '@/backend/utils/auth';

export async function GET(request: NextRequest) {
    const authError = await requireRole(request, ['admin', 'teacher']);
    if (authError) return authError;

    try {
        const stats = await AttendanceService.getInstitutionalAttendanceStats();
        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
