import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { JWTPayload, withAuth } from './withAuth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';

export { withAuth };
export type { JWTPayload };

/**
 * Verify JWT from cookies
 * @param req - NextRequest object (optional, for API routes)
 * @returns Decoded JWT payload or null if invalid
 */
export function verifyJWT(req?: NextRequest): JWTPayload | null {
    try {
        let token: string | undefined;

        if (req) {
            // For API routes with NextRequest
            token = req.cookies.get('token')?.value;
        } else {
            // For Server Components
            const cookieStore = cookies();
            token = cookieStore.get('token')?.value;
        }

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

/**
 * Verify JWT and check if user has required role
 * @param req - NextRequest object (optional)
 * @param allowedRoles - Array of allowed roles
 * @returns Decoded JWT payload or null if unauthorized
 */
export function verifyJWTWithRole(req: NextRequest | undefined, allowedRoles: string[]): JWTPayload | null {
    const payload = verifyJWT(req);

    if (!payload) {
        return null;
    }

    if (!allowedRoles.includes(payload.role)) {
        return null;
    }

    return payload;
}
