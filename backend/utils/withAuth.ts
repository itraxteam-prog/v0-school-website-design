import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
    name?: string;
}

/**
 * Server-side authentication wrapper with smart redirects
 * Use this in Server Components (Layouts/Pages) to protect routes
 * @param allowedRoles - Array of roles that can access the page
 * @returns User payload if authorized, otherwise redirects
 */
export async function withAuth(allowedRoles: string[]): Promise<JWTPayload> {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    // No token - redirect to login
    if (!token) {
        redirect('/portal/login');
    }

    try {
        const { payload } = await jwtVerify(token, ENCODED_SECRET);
        const userPayload = payload as unknown as JWTPayload;

        // User has valid token but wrong role - redirect to their portal
        if (!allowedRoles.includes(userPayload.role)) {
            const rolePortalMap: Record<string, string> = {
                'admin': '/portal/admin',
                'teacher': '/portal/teacher',
                'student': '/portal/student'
            };

            const userPortal = rolePortalMap[userPayload.role];
            if (userPortal) {
                redirect(userPortal);
            } else {
                // Unknown role - redirect to login
                redirect('/portal/login');
            }
        }

        // User is authorized
        return userPayload;
    } catch (error) {
        console.error('JWT verification failed in withAuth:', error);
        redirect('/portal/login');
    }
}
