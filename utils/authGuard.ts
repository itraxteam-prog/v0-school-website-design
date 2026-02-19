import { withAuth } from '@/utils/mockAuth';

/**
 * Mock server-side auth guard for protecting pages
 * Use this in Server Components
 * @param allowedRoles - Array of roles that can access the page
 * @returns Decoded JWT payload if authorized
 */
export async function requireAuth(allowedRoles: string[]) {
    return await withAuth(allowedRoles);
}
