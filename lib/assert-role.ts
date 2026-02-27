import { requireRole } from "./auth-guard";
import { Role } from "@prisma/client";

/**
 * Asserts that the current session has the ADMIN role.
 * Throws an error if not authorized or not an admin.
 * Use this in all admin-only server actions and API routes.
 */
export async function assertAdmin() {
    return await requireRole("ADMIN");
}

/**
 * Asserts that the current session has one of the specified roles.
 * @param roles Array of allowed roles
 */
export async function assertHasRole(roles: Role[]) {
    return await requireRole(roles);
}
