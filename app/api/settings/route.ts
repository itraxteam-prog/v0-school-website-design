export const runtime = 'nodejs'export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { settingsController } from '@/backend/controllers/settings';
import { validateBody, SettingsSchema } from '@/backend/validation/schemas';
import { createResponse, createErrorResponse, createSuccessResponse } from '@/backend/utils/apiResponse';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const result = await settingsController.getSettings();
        if (result.error) {
            return createErrorResponse(result.error, result.status);
        }
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
}

export async function PUT(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(SettingsSchema, body);
        if (validation.error) {
            return createErrorResponse(validation.error, 400);
        }

        const result = await settingsController.updateSettings(validation.data);
        if (result.error) {
            return createErrorResponse(result.error, result.status);
        }
        return createSuccessResponse(result.data, result.status);
    } catch (error: any) {
        return createErrorResponse(error.message || 'Failed to parse request body', 400);
    }
}

