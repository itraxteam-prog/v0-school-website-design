import { NextRequest } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { ClassService } from '@/backend/services/classes'; // For getting class details
import { PeriodService } from '@/backend/services/periods';
import { StudentService } from '@/backend/services/students';
import { AcademicService } from '@/backend/services/academicService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['student']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const studentId = auth.user.id; // User ID

        // 1. Get Student Profile to know Class ID
        const student = await StudentService.getById(studentId);
        if (!student) {
            return createErrorResponse('Student profile not found', 404);
        }

        // 2. Get Class Details
        const classId = student.classId;
        const cls = await ClassService.getById(classId);

        // 3. Get Schedule (Periods for this class)
        const periods = await PeriodService.getByClassIds([classId]);
        const schedule = periods.map(p => ({
            time: `${p.startTime} - ${p.endTime}`,
            class: cls?.name || 'Your Class',
            subject: p.name,
            room: cls?.roomNo || '-'
        })).sort((a, b) => a.time.localeCompare(b.time));

        // 4. Get Recent Grades
        const records = await AcademicService.getStudentRecords(studentId);
        const recentGrades = records?.slice(0, 5).map((r: any) => ({
            sub: r.subjects?.name || 'Unknown',
            type: r.term || 'Exam',
            date: new Date(r.exam_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
            marks: `${r.marks_obtained}/${r.total_marks}`,
            grade: r.grade
        })) || [];

        // 5. Calculate Performance (Avg Grade or similar)
        // Simple average of marks percentage
        let totalPercentage = 0;
        let count = 0;
        if (records) {
            records.forEach((r: any) => {
                if (r.total_marks > 0) {
                    totalPercentage += (r.marks_obtained / r.total_marks) * 100;
                    count++;
                }
            });
        }
        const avgPerformance = count > 0 ? Math.round(totalPercentage / count) : 0;

        // 6. Return Data
        const data = {
            stats: {
                performance: `${avgPerformance}%`,
                attendance: '95%', // Placeholder until we have student-specific attendance stats endpoint
                totalSubjects: records ? new Set(records.map((r: any) => r.subjects?.id)).size : 0,
                assignments: 3 // Placeholder
            },
            recentGrades,
            schedule,
            upcomingEvents: [ // Placeholder for now
                { title: "Science Fair", date: "Feb 20", type: "Event" },
                { title: "Math Quiz", date: "Feb 18", type: "Exam" }
            ]
        };

        return createSuccessResponse(data);

    } catch (error: any) {
        console.error('Student Dashboard Error:', error);
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
