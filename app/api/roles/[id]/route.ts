import { NextRequest } from 'next/server';
import { roleController } from '@/backend/controllers/roles';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // GET -> admin only
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await roleController.getById(params.id);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Role not found', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // PUT -> admin only
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const body = await req.json();
        const result = await roleController.update(params.id, body);
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
        // DELETE -> admin only
        const auth = await requireRole(req, ['admin']);
        if (!auth.authorized || !auth.user) return auth.response;

        const result = await roleController.delete(params.id);
        if (result.status >= 400) {
            return createErrorResponse(result.error || 'Delete failed', result.status);
        }
        return createSuccessResponse(result.data);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}
