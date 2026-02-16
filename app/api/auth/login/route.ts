import { NextRequest, NextResponse } from 'next/server';
import { authRoutes } from '@/backend/routes/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await authRoutes.login(body);

        if (result.status >= 400) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 });
    }
}
