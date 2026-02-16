import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';

export interface AuthPayload {
    id: string;
    email: string;
    role: string;
    name?: string;
    iat: number;
    exp: number;
}

// Function to verify JWT token from request headers or cookies
export async function verifyAuth(req: NextRequest | Request) {
    let token = '';

    // Check Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
    }
    // Check cookies if it's a NextRequest
    else if ('cookies' in req) {
        token = (req as NextRequest).cookies.get('token')?.value || '';
    }
    // Fallback for standard Request object (e.g. in some API handlers)
    else {
        const cookieHeader = req.headers.get('cookie');
        if (cookieHeader) {
            const match = cookieHeader.match(/token=([^;]+)/);
            if (match) token = match[1];
        }
    }

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

// Middleware function compliant with Next.js Middleware (if used in middleware.ts)
export async function authMiddleware(req: NextRequest) {
    const user = await verifyAuth(req);

    if (!user) {
        // If it's an API route, return 401
        if (req.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // If it's a page request, redirect to login
        const url = new URL('/portal/login', req.url);
        url.searchParams.set('from', req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);
    requestHeaders.set('x-user-email', user.email);
    if (user.name) requestHeaders.set('x-user-name', user.name);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}
