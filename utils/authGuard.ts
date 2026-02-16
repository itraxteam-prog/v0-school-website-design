import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWTWithRole } from '@/backend/utils/auth';

/**
 * Server-side auth guard for protecting pages
 * Use this in Server Components
 * @param allowedRoles - Array of roles that can access the page
 * @returns Decoded JWT payload if authorized, otherwise redirects to login
 */
export function requireAuth(allowedRoles: string[]) {
    const payload = verifyJWTWithRole(undefined, allowedRoles);

    if (!payload) {
        redirect('/portal/login');
    }

    return payload;
}
