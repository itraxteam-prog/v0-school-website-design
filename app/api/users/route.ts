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
        console.log('API POST /api/users - Request Body:', { ...body, password: '[REDACTED]' });

        // Validate
        const validation = await validateBody(RegisterSchema, body);
        if (validation.error) {
            console.error('API POST /api/users - Validation Failed:', validation.error);
            return NextResponse.json({
                success: false,
                error: validation.error
            }, { status: 400 });
        }

        // Use AuthService to handle hashing and user creation
        const result = await AuthService.register(validation.data);

        if (result.error) {
            console.error('API POST /api/users - AuthService Error:', result.error);
            LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'USER', undefined, 'failure', { error: result.error });
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: result.status || 500 });
        }

        console.log('API POST /api/users - Success:', (result.user as any)?.id);
        LogService.logAction(auth.user.id, auth.user.role, 'CREATE', 'USER', (result.user as any)?.id, 'success');

        return NextResponse.json({
            success: true,
            data: result.user
        }, { status: 201 });

    } catch (error: any) {
        console.error('API POST /api/users - Internal Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
