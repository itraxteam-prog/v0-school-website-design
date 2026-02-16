import { withAuth } from '@/backend/utils/withAuth';

/**
 * Server-side auth guard for protecting pages
 * Use this in Server Components
 * @param allowedRoles - Array of roles that can access the page
 * @returns Decoded JWT payload if authorized, otherwise redirects
 * 
 * @example
 * // In a Server Component
 * const user = await requireAuth(['admin']);
 */
export async function requireAuth(allowedRoles: string[]) {
    return await withAuth(allowedRoles);
}
