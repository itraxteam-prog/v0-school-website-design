import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';

export interface AuthPayload {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

// Function to verify JWT token from request headers
export async function verifyAuth(req: NextRequest | Request) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

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
// Note: verifyAuth is better suited for individual API routes in Node runtime
// For Edge runtime middleware, 'jose' library is recommended over 'jsonwebtoken'
export async function authMiddleware(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

        // In Next.js App Router, we can't easily 'attach' to the request object directly 
        // for downstream use in the same way as Express.
        // Instead, we usually return the user or set headers for the response.
        // Here we return the success state, or you could clone headers.

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', decoded.id);
        requestHeaders.set('x-user-role', decoded.role);
        requestHeaders.set('x-user-email', decoded.email);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}
