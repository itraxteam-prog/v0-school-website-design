import { authRoutes } from '@/backend/routes/auth';
import { verifyJWT } from '@/backend/utils/auth';
import { validateBody, ChangePasswordSchema } from '@/backend/validation/schemas';


export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        const payload = verifyJWT(req);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Validation Guard
        const validation = await validateBody(ChangePasswordSchema, body);
        if (validation.error) {
            return NextResponse.json({ success: false, message: validation.error }, { status: 400 });
        }

        const { currentPassword, newPassword } = validation.data;

        const result = await authRoutes.changePassword(payload.id, currentPassword, newPassword);

        if (result.status >= 400) {
            return NextResponse.json({
                success: false,
                message: result.error || 'Failed to change password'
            }, { status: result.status });
        }

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
