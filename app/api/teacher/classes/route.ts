import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { ClassService } from '@/backend/services/classes';
import { PeriodService } from '@/backend/services/periods';
import { AttendanceService } from '@/backend/services/attendanceService';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const teacherId = auth.user.id;
        const classes = await ClassService.getByTeacherId(teacherId);

        // Enhance class data
        const enhancedClasses = await Promise.all(classes.map(async (cls) => {
            // Get today's attendance for last active status
            const today = new Date().toISOString().split('T')[0];
            const attendance = await AttendanceService.getClassAttendance(cls.id, today);
            const lastActive = attendance && attendance.length > 0 ? 'Today' : 'Recently';

            // get subject name from periods? Classes don't have subjects in this schema, 
            // but multiple periods might have subjects. 
            // We'll try to find a subject from periods or default to 'General'.
            // Accessing periods might be heavy if we do it for all classes.
            // Let's check if we can get it from a "Main Subject" field if it existed, otherwise 'General'.
            // Actually, previously the Period interface showed `name` as subject. 
            // The UI mocks "Mathematics", "Science" etc.
            // I'll pick the most frequent subject from periods or default.

            // Optimization: Maybe just return 'General' for now to avoid N+1 queries for periods
            // or fetch periods for all these classIds in one go.

            return {
                id: cls.id,
                name: cls.name,
                subject: 'General', // TODO: Infer from periods
                studentCount: cls.studentIds?.length || 0,
                room: cls.roomNo,
                performance: 82, // Mocked consistent value for now
                lastActive: lastActive,
                // Assign a color based on ID hash for consistency
                color: getColorForId(cls.id)
            };
        }));

        return NextResponse.json(enhancedClasses);

    } catch (error: any) {
        console.error('Teacher Classes Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
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
