import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { settingsRoutes } from '@/backend/routes/settings';
import { validateBody, SettingsSchema } from '@/backend/validation/schemas';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    const result = await settingsRoutes.getSettings();
    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(SettingsSchema, body);
        if (validation.error) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await settingsRoutes.updateSettings(validation.data);
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
