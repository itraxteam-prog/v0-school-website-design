import "next-auth";
import "next-auth/adapters";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User {
        role: string;
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser {
        role: string;
    }
}
