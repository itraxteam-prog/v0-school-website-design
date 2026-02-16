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
        pathname.startsWith('/_next') ||
        pathname.includes('.') // Static files
    ) {
        return NextResponse.next();
    }

    if (!token) {
        const url = new URL('/portal/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    try {
        // Decode JWT payload without verification for routing purposes
        // Real verification happens in API routes and server components
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error('Invalid token');

        const decoded = JSON.parse(atob(payloadBase64));
        const userRole = decoded.role;

        // Role-based path protection
        if (pathname.startsWith('/portal/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/portal/403', request.url));
        }

        if (pathname.startsWith('/portal/teacher') && userRole !== 'teacher' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/portal/403', request.url));
        }

        if (pathname.startsWith('/portal/student') && userRole !== 'student' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/portal/403', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        const url = new URL('/portal/login', request.url);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/portal/:path*', '/api/:path*'],
};
