import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // Public paths
    if (
        pathname === '/' ||
        pathname.startsWith('/portal/login') ||
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
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error('Invalid token');

        const decoded = JSON.parse(atob(payloadBase64));
        const userRole = decoded.role;

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
