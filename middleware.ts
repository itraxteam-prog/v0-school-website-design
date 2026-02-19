import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // Public paths
    if (
        pathname === '/' ||
        pathname.startsWith('/portal/login') ||
        pathname.startsWith('/portal/forgot-password') ||
        pathname.startsWith('/portal/reset-password') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/test-env') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.') // Static files
    ) {
        return NextResponse.next();
    }

    const isApiRoute = pathname.startsWith('/api');

    if (!token) {
        if (isApiRoute) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL('/portal/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    try {
        const { payload } = await jwtVerify(token, ENCODED_SECRET);

        const userRole = payload.role as string;

        if (!userRole) {
            throw new Error('Role claim missing');
        }

        // Role-based path protection
        const isAdminPath = pathname.startsWith('/portal/admin');
        const isTeacherPath = pathname.startsWith('/portal/teacher');
        const isStudentPath = pathname.startsWith('/portal/student');

        if (isAdminPath && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/portal/403', request.url));
        }

        if (isTeacherPath && userRole !== 'teacher' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/portal/403', request.url));
        }

        if (isStudentPath && userRole !== 'student' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/portal/403', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        if (isApiRoute) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }
        const url = new URL('/portal/login', request.url);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/portal/:path*', '/api/:path*'],
};
