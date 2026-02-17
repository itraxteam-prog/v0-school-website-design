import { NextRequest } from 'next/server';
import { roleRoutes } from '@/backend/routes/roles';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    // GET -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const result = await roleRoutes.getAll();
        if (result.status >= 400) {
            return createErrorResponse(result.error, result.status);
        }
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function POST(req: NextRequest) {
    // POST -> admin only
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const result = await roleRoutes.create(body);
        if (result.status >= 400) {
            return createErrorResponse(result.error || result.errors, result.status);
        }
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Failed to process role creation', 400);
    }
}
