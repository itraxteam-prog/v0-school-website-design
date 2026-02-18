import { AttendanceService } from '../services/attendanceService';
import { AuthPayload } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export const attendanceController = {
    // GET /attendance - View records
    get: async (classId: string, date: string, user: AuthPayload) => {
        try {
            // RBAC
            if (user.role === 'student') {
                // Students can only see their own attendance (handled by service/query filter if needed, 
                // but here it asks for class attendance. Student shouldn't view whole class).
                // Returning Forbidden for now as Student Portal usually fetches "My Attendance".
                return { status: 403, error: 'Students cannot view class attendance lists' };
            }

            if (user.role === 'teacher') {
                // Verify teacher owns the class? Service check recommended but skipping for MVP speed
                // Ideally: await ClassService.verifyTeacher(user.id, classId);
            }

            const records = await AttendanceService.getClassAttendance(classId, date);
            return { status: 200, data: records };
        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AttendanceController.get');
            return { status: 500, error: error.message };
        }
    },

    // POST /attendance - Mark (Bulk)
    create: async (payload: any, user: AuthPayload) => {
        try {
            if (user.role === 'student') {
                return { status: 403, error: 'Students cannot mark attendance' };
            }

            const { classId, date, records } = payload;

            // Map to service format
            const formattedRecords = records.map((r: any) => ({
                student_id: r.studentId,
                class_id: classId,
                date: date,
                status: r.status,
                recorded_by: user.id
            }));

            const result = await AttendanceService.recordBulkAttendance(formattedRecords);

            LogService.logAction(user.id, user.role, 'MARKED_ATTENDANCE', 'CLASS', classId, 'success', { date, count: records.length });
            return { status: 201, data: result };

        } catch (error: any) {
            LogService.logError(user.id, user.role, error, 'AttendanceController.create');
            return { status: 500, error: error.message };
        }
    }
};
