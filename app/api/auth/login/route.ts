import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/authService';
import { AuditService } from '@/backend/services/auditService';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const metadata = { ip, userAgent };

    try {
        const { email, password, rememberMe } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }

        const result = await AuthService.login(email, password);

        if (result.error) {
            // Log failed login
            await AuditService.logLoginAttempt(email, 'failure', { ...metadata, error: result.error });
            return NextResponse.json({
                success: false,
                message: result.error
            }, { status: result.status || 401 });
        }

        // Handle 2FA Required
        if (result.requires2FA) {
            await AuditService.logLoginAttempt(email, 'failure', { ...metadata, requires2FA: true, note: 'Primary authentication success, 2FA required' });
            return NextResponse.json({
                success: true,
                requires2FA: true,
                tempToken: result.tempToken
            }, { status: 202 });
        }

        if (!result.token) {
            await AuditService.logLoginAttempt(email, 'failure', { ...metadata, error: 'No token generated' });
            return NextResponse.json({
                success: false,
                message: 'Authentication failed'
            }, { status: 401 });
        }

        // Log successful login
        if (result.user?.id) {
            await AuditService.logLoginAttempt(result.user.id, 'success', metadata);
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            user: {
                id: result.user?.id,
                name: result.user?.name,
                role: result.user?.role,
                email: result.user?.email
            }
        }, { status: 200 });

        // Cookie options for security
        const cookieOptions: any = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        };

        // Access Token - Short lived
        response.cookies.set('token', result.token, {
            ...cookieOptions,
            maxAge: 60 * 15 // 15 minutes
        });

        // Refresh Token - Long lived if rememberMe is true
        if (result.refreshToken) {
            response.cookies.set('refreshToken', result.refreshToken, {
                ...cookieOptions,
                maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined // 30 days or session
            });
        }

        return response;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'An internal error occurred'
        }, { status: 500 });
    }
}
