export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { periodController } from '@/backend/controllers/periods';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin', 'teacher', 'student']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await periodController.getById(params.id, auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Period not found', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const body = await req.json();
        const result = await periodController.update(params.id, body, auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Update failed', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await periodController.delete(params.id, auth.user);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Delete failed', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
