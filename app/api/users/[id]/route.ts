import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/backend/services/userService';
import { requireRole } from '@/backend/middleware/roleMiddleware';
import { LogService } from '@/backend/services/logService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const user = await UserService.getById(params.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    try {
        const body = await req.json();
        const updatedUser = await UserService.update(params.id, body);

        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'USER', params.id, 'success');
        return NextResponse.json(updatedUser);
    } catch (error: any) {
        LogService.logAction(auth.user.id, auth.user.role, 'UPDATE', 'USER', params.id, 'failure', { error: error.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireRole(req, ['admin']);
    if (!auth.authorized || !auth.user) return auth.response;

    if (auth.user.id === params.id) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    try {
        await UserService.delete(params.id);

        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'USER', params.id, 'success');
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        LogService.logAction(auth.user.id, auth.user.role, 'DELETE', 'USER', params.id, 'failure', { error: error.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
