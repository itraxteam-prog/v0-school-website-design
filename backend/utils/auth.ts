import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { JWTPayload, withAuth } from './withAuth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET);

export { withAuth };
export type { JWTPayload };

/**
 * Verify JWT from cookies (async — uses jose for signature verification)
 * @param req - NextRequest object (optional, for API routes)
 * @returns Decoded JWT payload or null if invalid
 */
export async function verifyJWT(req?: NextRequest): Promise<JWTPayload | null> {
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

        const { payload } = await jwtVerify(token, ENCODED_SECRET);
        if (!payload.role) return null;
        return payload as unknown as JWTPayload;
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
export async function verifyJWTWithRole(req: NextRequest | undefined, allowedRoles: string[]): Promise<JWTPayload | null> {
    const payload = await verifyJWT(req);

    if (!payload) {
        return null;
    }

    if (!allowedRoles.includes(payload.role)) {
        return null;
    }

    return payload;
}
