'use client';

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    role: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
        rememberMe: boolean
    ) => Promise<{ user?: User } | void>;
    verify2FA: (tempToken: string, code: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inner provider — must be inside <SessionProvider>
function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const loading = status === 'loading';

    const user: User | null = session?.user
        ? {
            id: session.user.id,
            role: session.user.role ?? 'student',
            email: session.user.email ?? '',
            name: session.user.name ?? '',
        }
        : null;

    const login = async (email: string, password: string, _rememberMe: boolean) => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            throw new Error('Invalid email or password');
        }

        // Redirect is handled by the login page after session refreshes
        return {};
    };

    // 2FA is not implemented in NextAuth credentials flow — stub kept for API compatibility
    const verify2FA = async (_tempToken: string, _code: string, _rememberMe: boolean) => {
        // No-op: extend with TOTP/email OTP logic later
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/portal/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, verify2FA, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Outer provider — wraps with NextAuth SessionProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
        </SessionProvider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
