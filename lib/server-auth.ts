import { requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

type SessionUser = {
    id: string;
    email?: string | null;
    role: Role;
};

/**
 * Legacy wrapper for requireRole to maintain compatibility.
 * Now uses the unified portal auth logic.
 */
export async function requireServerAuth(
    allowedRoles: Role[]
): Promise<SessionUser> {
    const session = await requireRole(allowedRoles);
    return session.user as SessionUser;
}

