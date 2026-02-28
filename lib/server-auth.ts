import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";

type SessionUser = {
    id: string;
    email?: string | null;
    role: Role;
};

export async function requireServerAuth(
    allowedRoles: Role[]
): Promise<SessionUser> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const user = session.user as SessionUser;

    if (!allowedRoles.includes(user.role)) {
        throw new Error("Unauthorized");
    }

    return user;
}
