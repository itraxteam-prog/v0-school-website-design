export const runtime = 'nodejs'export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { AcademicService } from '@/backend/services/academicService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['student', 'admin', 'teacher']); // Allow teacher/admin to view if they pass ID or context
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        let studentId = auth.user.id;

        // If teacher/admin provided studentId query param, utilize it?
        // For now, let's stick to "My Grades" usage for student.
        // If admin/teacher wants to view grades, they likely use a different endpoint or parameter.
        // Given the requirement is for Student Portal "My Grades":

        if (auth.user.role === 'student') {
            studentId = auth.user.id;
        } else {
            const { searchParams } = new URL(req.url);
            const qId = searchParams.get('studentId');
            if (qId) studentId = qId;
            else return createErrorResponse('Missing studentId', 400);
        }

        const records = await AcademicService.getStudentRecords(studentId);

        // Transform to UI friendly format
        const grades = records ? records.map((r: any) => ({
            id: r.id,
            subject: r.subjects?.name || 'Unknown',
            term: r.term || '-',
            // Assuming academic_records table structure fits the "Term 1, Term 2, Final" UI model?
            // Actually, the UI mocks "Term 1", "Term 2", "Term 3", "Final" separate columns.
            // But the database likely stores ONE record per exam/term.
            // E.g. "Math - Term 1 - 85".
            // We need to group them by Subject and Term for the "Detailed Grades" table if the table expects columns.
            // Or simple list.
            // The UI table has columns: Subject, Term 1, Term 2, Term 3, Final.
            // This implies a matrix view.
            // We'll flatten the data.
            // For now, return the raw list and let frontend handle matrix transformation if needed, 
            // OR transform here.
            // Let's return a list of "Grade Records" and let frontend displaying them as list or matrix.
            // The UI expects an array where each object has { subject, term1, term2, term3, final, grade }.
            // This requires pivoting the data.

            // Let's try to map the DB structure to the UI structure.
            marks: r.marks_obtained,
            total: r.total_marks,
            grade: r.grade,
            examDate: r.exam_date,
            type: r.term // "Mid-Term", "Final", etc.
        })) : [];

        // We'll return the linear records for now and maybe update frontend to display a list instead of a matrix,
        // OR pivot on frontend. Pivoting on frontend is safer.
        return createSuccessResponse(grades);

    } catch (error: any) {
        console.error('Student Grades Error:', error);
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

