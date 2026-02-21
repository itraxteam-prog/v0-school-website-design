import { useSession } from "next-auth/react";

export function useRole(allowedRoles: string[]) {
    const { data: session } = useSession();

    if (!session || !allowedRoles.includes(session.user.role)) {
        return false;
    }

    return true;
}
