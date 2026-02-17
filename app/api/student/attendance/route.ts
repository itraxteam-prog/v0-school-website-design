import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AttendanceService } from '@/backend/services/attendanceService';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['student']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const studentId = auth.user.id;
        const records = await AttendanceService.getStudentAttendance(studentId);

        // Return raw records. Frontend will process into calendar/stats.
        return NextResponse.json(records || []);

    } catch (error: any) {
        console.error('Student Attendance Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
