import { NextResponse } from 'next/server';
import { settingsRoutes } from '@/backend/routes/settings';

export async function GET() {
    const result = await settingsRoutes.getSettings();
    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const result = await settingsRoutes.updateSettings(body);
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
