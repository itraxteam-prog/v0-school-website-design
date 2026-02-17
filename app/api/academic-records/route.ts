import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { AcademicService } from '@/backend/services/academicService';
import { validateBody, AcademicRecordSchema } from '@/backend/validation/schemas';
import { AuthPayload } from '@/backend/services/authService';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) return auth.response;

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    // 1. Student viewing own records
    if (studentId) {
        if (auth.user.role === 'student' && auth.user.id !== studentId) {
            return NextResponse.json({ error: 'Forbidden: Cannot view other student records' }, { status: 403 });
        }

        try {
            const records = await AcademicService.getStudentRecords(studentId);
            LogService.logAction(auth.user.id, auth.user.role, 'READ_LIST', 'GRADES', studentId, 'success');
            return NextResponse.json(records);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // 2. Class Overview (Grade Distribution, etc.)
    if (classId) {
        if (auth.user.role === 'student') {
            return NextResponse.json({ error: 'Students cannot view class analytics' }, { status: 403 });
        }

        try {
            const stats = await AcademicService.getGradeDistribution(classId);
            LogService.logAction(auth.user.id, auth.user.role, 'READ_STATS', 'GRADES', classId, 'success');
            return NextResponse.json(stats);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Missing studentId or classId filter' }, { status: 400 });
}

export async function POST(req: NextRequest) {
    const auth = await requireRole(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Single Record Upsert for MVP
        const validation = await validateBody(AcademicRecordSchema, body);

        if (validation.error) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const {
            studentId, subjectId, term, marksObtained, totalMarks, grade, examDate, remarks
        } = validation.data!;

        const result = await AcademicService.upsertRecord({
            student_id: studentId,
            subject_id: subjectId,
            term,
            marks_obtained: marksObtained,
            total_marks: totalMarks,
            grade,
            exam_date: examDate,
            remarks
        });

        LogService.logAction(auth.user.id, auth.user.role, 'UPSERT_GRADE', 'GRADES', studentId, 'success', result);

        return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}
