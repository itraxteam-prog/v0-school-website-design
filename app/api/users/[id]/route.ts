import { NextRequest } from 'next/server';
import { UserService } from '@/backend/services/userService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const user = await UserService.getById(params.id);
        if (!user) {
            return createErrorResponse('User not found', 404);
        }
        return createSuccessResponse(user);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        const updatedUser = await UserService.update(params.id, body);

        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'USER', params.id, 'success');
        return createSuccessResponse(updatedUser);
    } catch (error: any) {
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'USER', params.id, 'failure', { error: error.message });
        return createErrorResponse(error.message, 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    if (auth.user.id === params.id) {
        return createErrorResponse('Cannot delete yourself', 400);
    }

    try {
        await UserService.delete(params.id);

        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'USER', params.id, 'success');
        return createSuccessResponse(null, 200, 'User deleted successfully');
    } catch (error: any) {
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'USER', params.id, 'failure', { error: error.message });
        return createErrorResponse(error.message, 500);
    }
}
