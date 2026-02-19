export const runtime = 'nodejs'export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { AttendanceService } from '@/backend/services/attendanceService';
import { validateBody, AttendanceSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');

    if (!classId || !date) {
        return createErrorResponse('Missing classId or date', 400);
    }

    // Role Logic: 
    // Student: Can only see their own attendance? 
    // Wait, the AttendanceService.getClassAttendance returns EVERYONE in the class.
    // If student calls this, they see everyone.
    if (auth.user.role === 'student') {
        // Students should probably use a diff endpoint or filter here.
        // For now, let's block student from "Class List" view.
        return createErrorResponse('Students cannot view class lists', 403);
    }

    try {
        const data = await AttendanceService.getClassAttendance(classId, date);
        LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'ATTENDANCE', classId, 'success');
        return createSuccessResponse(data);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Validation
        const validation = await validateBody(AttendanceSchema, body);
        if (validation.error) {
            return createErrorResponse(validation.error, 400);
        }

        const { classId, date, records } = validation.data!;

        // Transform for Service
        const servicePayload = records.map((r: any) => ({
            student_id: r.studentId,
            class_id: classId,
            date: date,
            status: r.status,
            recorded_by: auth.user!.id
        }));

        const result = await AttendanceService.recordBulkAttendance(servicePayload);

        LogService.logAction(auth.user.id, auth.user.role, 'CREATE_BULK', 'ATTENDANCE', classId, 'success', { count: records.length });

        return createSuccessResponse(result, 201);

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Error', 500);
    }
}

