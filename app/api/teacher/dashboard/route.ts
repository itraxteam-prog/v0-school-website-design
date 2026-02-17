import { NextRequest } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { ClassService } from '@/backend/services/classes';
import { PeriodService } from '@/backend/services/periods';
import { StudentService } from '@/backend/services/students';
import { AttendanceService } from '@/backend/services/attendanceService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const teacherId = auth.user.id; // Assuming user.id maps to teacher.id or we need to look it up

        // 1. Get Classes assigned to teacher
        // Note: The teacherId in `classes` table is expected to be the user ID or linked teacher ID.
        // If auth.user.id is the UUID from auth.users, and classes.classTeacherId uses that UUID, we are good.
        const classes = await ClassService.getByTeacherId(teacherId);

        // 2. Calculate Total Students
        // We can either count IDs in the class record or fetch students
        let totalStudents = 0;
        const classIds = classes.map(c => c.id);

        // Parallelize fetching student counts if needed, but if we trust studentIds array:
        totalStudents = classes.reduce((sum, cls) => sum + (cls.studentIds?.length || 0), 0);

        // 3. Get Today's Schedule (Periods for these classes)
        const periods = await PeriodService.getByClassIds(classIds);

        // Filter/Format schedule for "Today" (Assuming all periods recur daily or we don't have day filter yet)
        const schedule = periods.map(p => {
            // Find class name
            const cls = classes.find(c => c.id === p.classId);
            return {
                time: `${p.startTime} - ${p.endTime}`,
                class: cls?.name || 'Unknown Class',
                subject: p.name, // "subject" in UI is "name" in Period Interface now
                room: cls?.roomNo || 'Unknown Room'
            };
        }).sort((a, b) => a.time.localeCompare(b.time)); // Simple sort, might need better time parsing

        // 4. Get Attendance Stats (Today)
        const today = new Date().toISOString().split('T')[0];
        let presentCount = 0;
        let totalAttendanceRecords = 0;

        // Fetch attendance for each class for today
        await Promise.all(classIds.map(async (cid) => {
            const records = await AttendanceService.getClassAttendance(cid, today);
            if (records) {
                totalAttendanceRecords += records.length;
                presentCount += records.filter(r => r.status === 'present').length;
            }
        }));

        const attendancePercentage = totalAttendanceRecords > 0
            ? Math.round((presentCount / totalAttendanceRecords) * 100)
            : 0;

        // 5. Construct Response
        const data = {
            stats: {
                totalClasses: classes.length,
                totalStudents,
                attendanceToday: attendancePercentage > 0 ? `${attendancePercentage}%` : 'N/A',
                pendingGrades: 12 // Placeholder as we don't have a "submissions" table yet
            },
            schedule: schedule.length > 0 ? schedule : [], // meaningful empty state
            classes: classes.map(c => ({
                name: c.name,
                subject: 'General', // Classes don't have subject in schema, periods do. 
                students: c.studentIds?.length || 0
            }))
        };

        return createSuccessResponse(data);

    } catch (error: any) {
        console.error('Teacher Dashboard Error:', error);
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
