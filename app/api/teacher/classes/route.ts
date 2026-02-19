export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { ClassService } from '@/backend/services/classes';
import { PeriodService } from '@/backend/services/periods';
import { AttendanceService } from '@/backend/services/attendanceService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';
import { unstable_cache } from 'next/cache';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const teacherId = auth.user.id;

        // Cache the core class and period data
        const { classes, periodsByClass } = await unstable_cache(
            async (tid: string) => {
                const cls = await ClassService.getByTeacherId(tid);
                const classIds = cls.map(c => c.id);
                const prds = await PeriodService.getByClassIds(classIds);

                const grouped = prds.reduce((acc, p) => {
                    if (!acc[p.classId]) acc[p.classId] = [];
                    acc[p.classId].push(p);
                    return acc;
                }, {} as Record<string, any[]>);

                return { classes: cls, periodsByClass: grouped };
            },
            [`teacher-classes-${teacherId}`],
            { tags: ['classes', 'periods'], revalidate: 3600 }
        )(teacherId);

        // Enhance class data with attendance and inferred subjects
        const enhancedClasses = await Promise.all(classes.map(async (cls) => {
            // Attendance check (considered dynamic, not cached here for now)
            const today = new Date().toISOString().split('T')[0];
            const attendance = await AttendanceService.getClassAttendance(cls.id, today);
            const lastActive = attendance && attendance.length > 0 ? 'Today' : 'Recently';

            // Infer subject from periods (use first period name as primary subject)
            const classPeriods = periodsByClass[cls.id] || [];
            const subject = classPeriods.length > 0 ? classPeriods[0].name : 'General';

            return {
                id: cls.id,
                name: cls.name,
                subject: subject,
                studentCount: cls.studentIds?.length || 0,
                room: cls.roomNo,
                performance: 82, // Mocked consistent value for now
                lastActive: lastActive,
                color: getColorForId(cls.id)
            };
        }));

        return createSuccessResponse(enhancedClasses);

    } catch (error: any) {
        console.error('Teacher Classes Error:', error);
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

function getColorForId(id: string) {
    const colors = [
        "from-blue-500/10 to-transparent",
        "from-purple-500/10 to-transparent",
        "from-emerald-500/10 to-transparent",
        "from-amber-500/10 to-transparent",
        "from-rose-500/10 to-transparent",
        "from-indigo-500/10 to-transparent"
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

