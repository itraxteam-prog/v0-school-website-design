export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { SubjectService } from '@/backend/services/subjectService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const subjects = await SubjectService.getAll();
        return createSuccessResponse(subjects);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireRole(request, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await request.json();
        const subject = await SubjectService.create(body);
        return createSuccessResponse(subject, 201);
    } catch (error: any) {
        return createErrorResponse(error.message, 400);
    }
}
