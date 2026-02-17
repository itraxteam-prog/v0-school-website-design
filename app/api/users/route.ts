import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/backend/services/userService';
import { AuthService } from '@/backend/services/authService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { validateBody, RegisterSchema } from '@/backend/validation/schemas';
import { LogService } from '@/backend/services/logService';

export async function GET(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const users = await UserService.getAll();
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();

        // Validate
        const validation = await validateBody(RegisterSchema, body);
        if (validation.error) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Use AuthService to handle hashing and user creation
        const result = await AuthService.register(validation.data);

        if (result.error) {
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'USER', undefined, 'failure', { error: result.error });
            return NextResponse.json({ error: result.error }, { status: result.status || 500 });
        }

        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'USER', (result.user as any)?.id, 'success');
        return NextResponse.json(result.user, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
