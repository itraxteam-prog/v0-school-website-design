import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";

export async function exportGuard(allowedRoles: Role[]) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    if (!allowedRoles.includes(session.user.role as Role)) {
        throw new Error("Forbidden");
    }

    return session.user;
}
